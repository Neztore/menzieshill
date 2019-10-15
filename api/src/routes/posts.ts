import express from "express";

const posts = express.Router();

posts.get('/:page', (_req, res) => res.send({
    message: "Get posts",
    status: 200
}));

posts.post('/', (_req, res) => res.send({
    message: "Add post.",
    status: 200
}));

posts.patch('/:postId', (_req, res) => res.send({
    message: "edit post.",
    status: 200
}));

posts.delete('/:postId', (_req, res) => res.send({
    message: "delete post.",
    status: 200
}));


export default  posts
