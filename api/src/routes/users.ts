import express, {Request, Response} from "express";
import { isEmail, escape, normalizeEmail, trim, isAscii, isLength, isEmpty, isAlpha } from 'validator';
import { errorGenerator, errorCatch } from '../util/errors'
const users = express.Router();
import Database from '../db/index'
import { hash, compare } from 'bcrypt';


// UserEntity ID should be either a valid userId string or @me
users.get('/', (_req, res) => res.status(204).send({
    message: "Empty page: No content.",
    status: 204
}));

/*
    Req.body:
        username: Desired username
        password: Plaintext password that they want.
        email: Email address of the user
        firstName: First name of user; GDPR protected.
        lastName: First name of user; GDPR protected.
        By default users are assigned 'guest' and updated to 'member'?
 */


users.post('/register', errorCatch(async (req: Request, res: Response): Promise<any> => {
    const errors = [];
    // Validations
    let { username, password, email, firstName, lastName } = req.body;

    if (!username || isEmpty(username) || !isAscii(username) || !isLength(username, { min: 3, max: 20 })) {
        errors.push("Username must be ASCII and between 3 and 20 characters.")
    } else {
        username = trim(escape(username))
    }

    if (!password || isEmpty(password) || !isAscii(password) || !isLength(password, { min: 8, max: 50 })) {
        errors.push("Password must be between 8 and 50 characters.")
    }

    if (!email || isEmpty(email) || !isEmail(email)) {
        errors.push("Invalid email: Please check it and try again.")
    } else {
        email = normalizeEmail(email)
    }

    if (!firstName || isEmpty(firstName) || !isAlpha(firstName)) {
        errors.push("Invalid first name: Please check it and try again.")
    } else {
        firstName = trim(escape(firstName))
    }

    if (!lastName || isEmpty(lastName) || !isAlpha(lastName)) {
        errors.push("Invalid last name: Please check it and try again.")
    } else {
        lastName = trim(escape(lastName))
    }

    if (errors.length !== 0) {
        // There are errors: Return them
        return res.status(400).send(errorGenerator(400, "Bad registration information", {errors: errors}));
    } else {
        // No errors. Continue.
        // Check for already existing user
        const exists = await Database.checkUserExists(username, email);
        if (exists) {
            res.status(400).send(errorGenerator(400, "Username or email is already associated with an existing account."))
        } else {

            // Hash - 12 hash rounds.
            const result = await hash(password, 12);
            console.log(result);
            // Create user

            await Database.addUser({
                username,
                email,
                firstName,
                lastName,
                hash: result
            });
            res.send({
                msg: "Success: User created",
                success: true,
                username: username,
                email: email
            })
        }


    }
}));

users.post('/login', errorCatch(async (req: Request, res: Response) => {
    // Validations - Username can be username OR email.
    let { username, password } = req.body;
    // We pass it in to both because they can put email or their username in the 'username' field for ease
    const user = await Database.checkUserExists(username, username);
    if (!user) {
        return res.status(400).send(errorGenerator(400, "Username or password is incorrect. Please check them and try again."))
    } else {
        // User exists: Let's check the password.
        const correct = await compare(password, user.hash);
        if (correct) {
            res.send({msg: "Correct!"})
        } else {
            return res.status(400).send(errorGenerator(400, "Username or password is incorrect. Please check them and try again."))
        }
    }
}));

users.patch('/:userId', (_req, res) => res.send({
    message: "Edit user (settings)?",
    status: 200
}));

users.delete('/:userId', (_req, res) => res.send({
    message: "delete user.",
    status: 200
}));

export default users

