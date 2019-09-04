import express from "express";

const users = express.Router();

// User ID should be either a valid userId string or @me
users.get('/', (_req, res) => res.status(204).send({
    message: "Empty page: No content.",
    status: 204
}));

users.post('/register', (_req, res) => res.send({
    message: "Add user (register).",
    status: 200
}));

users.post('/login', (_req, res) => res.send({
    message: "Login to account.",
    status: 200
}));

users.patch('/:userId', (_req, res) => res.send({
    message: "Edit user (settings)?",
    status: 200
}));

users.delete('/:userId', (_req, res) => res.send({
    message: "delete user.",
    status: 200
}));



