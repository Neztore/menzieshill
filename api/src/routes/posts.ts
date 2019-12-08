import express, {Request, Response} from "express";
import auth from '../middleware/auth'
import {cleanString, errorCatch, errorGenerator, Perms, validId, validString} from "../util";
import {Post} from "../db/entity/Post.entity";
import Group from "../db/entity/Group.entity";
import Database from "../db";

// Constants
const pageSize = 30;


const posts = express.Router();
posts.get('/list', errorCatch(async (_req: Request, res: Response) =>{
    const posts = await Database.getPosts(0, pageSize);
    res.send({success: true, posts})
}));
// Gets (Unauthenticated)
posts.get('/list/:page', errorCatch(async (req: Request, res: Response) =>{
    if (req.params.page && validId(req.params.page)) {
        const pageNo = parseInt(req.params.page, 10);
        const posts = await Database.getPosts(pageNo * pageSize, pageSize);
        res.send({success: true, posts})
    } else {
        return res.status(400).send(errorGenerator(400, "Bad page number."))
    }
}));

// Get specific
posts.get('/:postId', errorCatch(async (req: Request, res: Response) =>{
    if (req.params.postId && validId(req.params.postId)) {
        const post = await Database.getPost(parseInt(req.params.postId, 10));
        if (post) {
            return res.send({success: true, post})
        } else {
            return res.status(404).send(errorGenerator(400, "Post not found."))
        }
    } else {
        return res.status(400).send(errorGenerator(400, "Bad post id number."))
    }

}));


posts.use(auth([Perms.ManagePosts]));
posts.post('/', errorCatch(async (req: Request, res: Response) =>{
    if (!req.user) return;
    const newPost = new Post();
    const errors = await modifyPost(newPost, req.body)
    if (errors.length !== 0) {
        // Theres a group error.
        return res.status(400).send(errorGenerator(400, "Bad group id provided", {badIds: errors}))
    }
    if (!newPost.title || !newPost.content) {
        return res.status(400).send(errorGenerator(400, "You must provide both title and content for this post."))
    }
    newPost.author = req.user;
    // It's OK: Save it.
    const result = await Database.savePost(newPost);
    res.send({success: true, message: "Successfully created post", result})

}));

posts.patch('/:postId', errorCatch(async (req: Request, res: Response) =>{
    if (!req.user) return console.error("No user.");
    if (validId(req.params.postId)) {
        const post = await Database.getPost(parseInt(req.params.postId, 10));
        if (!post) {
            return res.status(404).send(errorGenerator(404, "Post not found."))
        }

        if (post.author.id !== req.user.id) {
            // Matches: Delete.
            res.status(403).send(errorGenerator(403, "Forbidden: You do not own that post."))
        }

        const errors = await modifyPost(post, req.body);
        if (errors.length !== 0) {
            // Theres a group error.
            return res.status(400).send(errorGenerator(400, "Bad group id provided", {badIds: errors}))
        }

        if (!post.title || !post.content) {
            return res.status(400).send(errorGenerator(400, "You must provide both title and content for this post."))
        }
        post.author = req.user;
        // It's OK: Save it.
        const result = await Database.savePost(post);
        res.send({success: true, message: "Successfully updated post", result})

    } else {
        res.status(400).send(errorGenerator(400, "Bad post id."))
    }

}));

async function modifyPost (post: Post, body: any) {
    const errors: string[] = [];
    if (validString(body.title, 50)) {
        post.title = cleanString(body.title)
    }

    if (body.content && typeof body.content === "string") {
        post.content = cleanString(body.content)
    }

    if (body.groups && Array.isArray(body.groups)) {
        const validGroups: Group[] = [];


        for (let groupId of body.groups) {
            if (groupId && typeof groupId === "number" && groupId > 0 && groupId < 2000) {
                // now check if they actually map to a group
                const group:undefined|Group = await Database.getGroup(groupId);
                if (group) {
                    validGroups.push(group)
                }else {
                    errors.push(`Invalid group: ${groupId}`)
                }
            } else {
                errors.push(`Invalid group: ${groupId}`)
            }
        }
        post.groups = validGroups;
    }
    return errors;
}

posts.delete('/:postId',errorCatch(async (req: Request, res: Response) =>{
    if (!req.user) return;
    if (validId(req.params.id)) {
        const post = await Database.getPost(parseInt(req.params.id, 10));
        if (!post) {
            return res.status(404).send(errorGenerator(404, "Post not found."))
        }
        if (post.author.id === req.user.id) {
            // Matches: Delete.
            await Database.deletePost(post);
            return res.status(204)
        } else {
            res.status(403).send(errorGenerator(403, "Forbidden: You do not own that post."))
        }

    } else {
        res.status(400).send(errorGenerator(400, "Bad post id."))
    }

}));


export default  posts
