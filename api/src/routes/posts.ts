import express, { Request, Response } from "express";

import Database from "../db";
import { Group } from "../db/entity/Group.entity";
import { Post } from "../db/entity/Post.entity";
import auth from "../middleware/auth";
import {
  cleanString, errorCatch, errorGenerator, Perms, validId, validString
} from "../util";

// Constants
const pageSize = 30;

const posts = express.Router();
posts.get("/list", errorCatch(async (_req: Request, res: Response) => {
  const allPosts = await Database.getPosts(0, pageSize);
  res.send({
    success: true,
    allPosts
  });
}));
// Gets (Unauthenticated)
posts.get("/list/:page", errorCatch(async (req: Request, res: Response) => {
  if (req.params.page && validId(req.params.page)) {
    const pageNo = parseInt(req.params.page, 10);
    const postsPage = await Database.getPosts(pageNo * pageSize, pageSize);
    return res.send({
      success: true,
      postsPage
    });
  }
  return res.status(400).send(errorGenerator(400, "Bad page number."));
}));

// Get specific
posts.get("/:postId", errorCatch(async (req: Request, res: Response) => {
  if (req.params.postId && validId(req.params.postId)) {
    const post = await Database.getPost(parseInt(req.params.postId, 10));
    if (post) {
      return res.send({
        success: true,
        post
      });
    }
    return res.status(404).send(errorGenerator(404, "Post not found."));
  }
  return res.status(400).send(errorGenerator(400, "Bad post id number."));
}));

posts.use(auth([Perms.managePosts]));
posts.post("/", errorCatch(async (req: Request, res: Response) => {
  if (!req.user) return undefined;
  const newPost = new Post();
  const errors = await modifyPost(newPost, req.body);
  if (errors.length !== 0) {
    // Theres a group error.
    return res.status(400).send(errorGenerator(400, "Bad group id provided", { badIds: errors }));
  }
  if (!newPost.title || !newPost.content) {
    return res.status(400).send(errorGenerator(400, "You must provide both title and content for this post."));
  }
  newPost.author = req.user;
  // It's OK: Save it.
  const result = await Database.savePost(newPost);
  return res.send({
    success: true,
    message: "Successfully created post",
    result
  });
}));

posts.patch("/:postId", errorCatch(async (req: Request, res: Response) => {
  if (!req.user) return console.error("No user.");
  if (validId(req.params.postId)) {
    const post = await Database.getPost(parseInt(req.params.postId, 10));
    if (!post) {
      return res.status(404).send(errorGenerator(404, "Post not found."));
    }

    if (post.author.id !== req.user.id) {
      // Matches: Delete.
      return res.status(403).send(errorGenerator(403, "Forbidden: You do not own that post."));
    }

    const errors = await modifyPost(post, req.body);
    if (errors.length !== 0) {
      // Theres a group error.
      return res.status(400).send(errorGenerator(400, "Bad group id provided", { badIds: errors }));
    }

    if (!post.title || !post.content) {
      return res.status(400).send(errorGenerator(400, "You must provide both title and content for this post."));
    }
    post.author = req.user;
    // It's OK: Save it.
    const result = await Database.savePost(post);
    return res.send({
      success: true,
      message: "Successfully updated post",
      post: result
    });
  }
  return res.status(400).send(errorGenerator(400, "Bad post id."));
}));

async function modifyPost (post: Post, body: any): Promise<string[]> {
  const errors: string[] = [];
  if (validString(body.title, 50)) {
    // eslint-disable-next-line no-param-reassign
    post.title = cleanString(body.title);
  }

  if (body.content && typeof body.content === "string") {
    // eslint-disable-next-line no-param-reassign
    post.content = cleanString(body.content);
  }

  if (body.groups && Array.isArray(body.groups)) {
    const validGroups: Group[] = [];

    for (const groupId of body.groups) {
      if (groupId && typeof groupId === "number" && groupId > 0 && groupId < 2000) {
        // now check if they actually map to a group
        // eslint-disable-next-line no-await-in-loop
        const group:undefined|Group = await Database.getGroup(groupId);
        if (group) {
          validGroups.push(group);
        } else {
          errors.push(`Invalid group: ${groupId}`);
        }
      } else {
        errors.push(`Invalid group: ${groupId}`);
      }
    }
    // eslint-disable-next-line no-param-reassign
    post.groups = validGroups;
  }
  return errors;
}

posts.delete("/:postId", errorCatch(async (req: Request, res: Response) => {
  if (!req.user) return undefined;
  if (validId(req.params.postId)) {
    const post = await Database.getPost(parseInt(req.params.postId, 10));
    if (!post) {
      return res.status(404).send(errorGenerator(404, "Post not found."));
    }
    if (post.author.id === req.user.id) {
      // Matches: Delete.
      await Database.deletePost(post);
      return res.status(200).send({ success: true });
    }
    return res.status(403).send(errorGenerator(403, "Forbidden: You do not own that post."));
  }
  return res.status(400).send(errorGenerator(400, "Bad post id."));
}));

export default posts;
