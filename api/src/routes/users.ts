import express, {Request, Response} from "express";
import Database from '../db/index'

import {escape, isAlpha, isEmail, isEmpty, isNumeric, normalizeEmail, trim} from 'validator';
import {compare, hash} from 'bcrypt';

import {
    errorCatch,
    errorGenerator,
    errors,
    generateToken,
    getPerms,
    hasPerms,
    Perms,
    validId,
    validPassword,
    validRealName,
    validUsername
} from '../util'
import checkAuth from "../middleware/auth";
import {authLife} from '../../config'

import Group from "../db/entity/Group.entity";
import User from "../db/entity/User.entity";
import EmailSystem from "../util/email";

const users = express.Router();



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

    if (!validUsername(username)) {
        errors.push({field: "username", msg: 'Username must be between 3 and 20 characters and contain only letters, numbers and the symbols ".", "-" or "_".'});
    } else {
        username = trim(escape(username))
    }

    if (!validPassword(password)) {
        errors.push({field: "password", msg: "Password must be between 8 and 50 characters."})
    }

    if (!email || isEmpty(email) || !isEmail(email)) {
        errors.push({field: "email", msg: "Invalid email: Please check it and try again."})
    } else {
        email = normalizeEmail(email)
    }

    if (!firstName || isEmpty(firstName) || !isAlpha(firstName)) {
        errors.push({field: "firstName", msg: "Invalid first name: Please check it and try again."})
    } else {
        firstName = trim(escape(firstName))
    }

    if (!lastName || isEmpty(lastName) || !isAlpha(lastName)) {
        errors.push({field: "lastName", msg: "Invalid last name: Please check it and try again."})
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
            const msg = exists.username === username ? {field: "username", msg: "Username is already in use by another account."}:{field: "email", msg:"This email is already in use on another account."};
            res.status(400).send(errorGenerator(400, "Username or email is already associated with an existing account.", {errors: [msg]}))
        } else {

            // Hash - 12 hash rounds.
            const result = await hash(password, 12);
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
    const errors = [];
    // Validation
    if (!validUsername(username)) {
        errors.push('Username must be between 3 and 20 characters and contain only letters, numbers and the symbols ".", "-" or "_".');
    } else {
        username = trim(escape(username))
    }

    if (!validPassword(password)) {
        errors.push("Password must be between 8 and 50 characters.")
    }

    if (errors.length !== 0) {
        // There are errors: Return them
        return res.status(400).send(errorGenerator(400, "Invalid username or password.", {errors: errors}));
    }
    // Actual logic

    // We pass it in to both because they can put email or their username in the 'username' field for ease
    const user = await Database.checkUserExists(username, username);
    if (!user) {
        return res.status(400).send(errorGenerator(400, "Username or password is incorrect. Please check them and try again."))
    } else {
        // User exists: Let's check the password.
        const correct = await compare(password, user.hash);
        if (correct) {
            const p1 = generateToken();
            const p2 = Database.getUser(user.id, true);

            const token = await p1;
            const fullUser = await p2;

            // Auth validity check
            if (fullUser && fullUser.auth && fullUser.auth.length > 0) {
                // Too many check
                if (fullUser.auth.length > 50) {
                    // Too many sessions: Invalidating them all.
                    console.warn(`User ${fullUser.id} (${fullUser.username}) has too many sessions. Expiring them.`);
                    await Database.clearAuth(fullUser);
                } else {
                    for (let c=0; c<fullUser.auth.length; c++) {
                        const timeSince = Date.now() - fullUser.auth[c].created.getTime();
                        const numLife = Number(authLife);
                        if (timeSince > numLife * 1000) {
                            Database.deleteAuth(fullUser.auth[c])
                        }
                    }
                }
            }

            // Save cookie in DB
             await Database.setAuth(user.id, token);

            // Send cookie to client
            res
                .cookie('token', token, {
                httpOnly: true,
                /* A week */
                expires: new Date(Date.now() + 604800000),
                //secure: true During dev we have no https. Probably should enable in future.
            });
                // TODO: Make this compatible with client somehow.
                res.send({success: true, message: "Logged in."})


        } else {
            return res.status(400).send(errorGenerator(400, "Username or password is incorrect. Please check them and try again."))
        }
    }
}));


// UserEntity ID should be either a valid userId string or @me
users.get('/:id', errorCatch(async (req: Request, res:Response) => {
    if (!req.params.id || isEmpty(req.params.id) || !isNumeric(req.params.id)) {
        if (req.params.id === "@me") {
            const auth = await Database.getAuthByToken(req.cookies.token)
            if (auth && auth.user) {
                const fullUser = await Database.getUser(auth.user.id)
                return res.send(fullUser);
            } else {
                return  res.status(400).send(errorGenerator(401, "You are not logged in."));
            }

        } else {
            return  res.status(400).send(errorGenerator(400, "Invalid user id."));
        }
    }
    if (!req.user) return false;
    if (hasPerms(req.user, [Perms.Admin])) {

        const user = await Database.getUser(parseInt(req.params.id, 10));
        if (user) {
            res.send(user);
        } else {
            res.status(404).send(errorGenerator(404, "User not found."))
        }
    } else {
        res.status(errors.forbidden.error.status).send(errors.forbidden)
    }
}));

users.use(checkAuth());
    // * It should take both currentPassword and newPassword.
    // * Will also need a way to reset password via. email.
users.patch('/@me', errorCatch(async (req: Request, res: Response) =>{
    if (req.user && req.user.id) {
        const user = Object.assign({}, req.user);
        // password stuff
        if (req.body.password) {
            if (req.body.confirmPassword) {
                if (validPassword(req.body.password) && validPassword(req.body.confirmPassword)) {
                    if (req.body.password === req.body.confirmPassword) {
                        if (req.body.oldPassword && validPassword(req.body.oldPassword)) {
                            // We use this as this is the only method which includes hash.
                            const fullUser = await Database.checkUserExists(user.username, user.email);
                            if (!fullUser) throw new Error("Failed to get user");
                            if (await compare(req.body.oldPassword, fullUser.hash)) {
                                user.hash = await hash(req.body.password, 12);

                                // Long, but needed.I
                                await EmailSystem.send("passwordReset", user.email, `Password changed`, {
                                    name: user.firstName,
                                    rest: `following your request.`,
                                    username: user.username
                                });
                                await doReq(user, req, res, true)
                            } else {
                                return res.status(401).send(errorGenerator(401, "Incorrect old password."))
                            }
                        } else {
                            return res.status(401).send(errorGenerator(401, "You must provide old password to do that."))
                        }
                    } else {
                        // These errors are cancer. Sigh. For consistency!
                        return res.status(400).send(
                            errorGenerator(400, `passwords must match.`,
                                { errors: [{field: "password", msg: "passwords must match"}] }))
                    }
                } else {
                    return res.status(400).send(
                        errorGenerator(400, `Please provide both password and confirm password and ensure they are valid.`,
                            { errors: [{field: "password", msg: "Please provide both password and confirm password and ensure they are valid"}] }))
                }
            } else {
                return res.status(400).send(
                    errorGenerator(400, `Please provide both password and confirm password and ensure they are valid.`,
                        { errors: [{field: "password", msg: "Please provide both password and confirm password and ensure they are valid"}] }))
            }
        } else {
            await doReq(user, req, res, false)
        }
    } else {
        throw new Error("No req.user set for update @me")
    }
}));

// Authenticated routes.
users.use(checkAuth([Perms.Admin]));
users.patch('/:userId', errorCatch(async (req: Request, res: Response) =>{
    const { userId } = req.params;

    if (userId && validId(userId)) {
        let parsedId = parseInt(userId,10);
        let user = await Database.getUser(parsedId)
        if (user) {
            user = Object.assign({}, user);
            // do password
            if (req.body.password) {
                if (!validPassword(req.body.password)) {
                    return res.status(400).send(errorGenerator(400, "Bad password", {errors: [{field: "password", msg: "Invalid password. Please ensure it is long enough."}]}));
                }
                user.hash = await hash(req.body.password, 12)
                // Long, but needed.
                await EmailSystem.send("passwordReset", user.email, `Password changed`, {
                    name: user.firstName,
                    username: user.username,
                    rest: `by a site administrator (${req.user ? req.user.username : "Unknown"})`
                });

                await doReq(user, req, res, true)
            } else {
                await doReq(user, req, res, false)
            }

        } else {
            res.status(404).send(errorGenerator(404, "User not found."))
        }
    } else {
        res.status(400).send(errorGenerator(400, "Bad user id."))
    }
}));

async function doReq (user:User, req: Request, res: Response, passwordModified:boolean) {
    if (!req.body) return res.status(400).send(errorGenerator(400, "No body provided."))
    const resp = await userEdit(user, req.body);
    if (resp.length !== 0) {
        return res.status(400).send(errorGenerator(400, `There were some errors, please see "errors" array.`, { errors: resp }))
    } else {
        await Database.saveUser(user);
        const sendUser = Object.assign({}, user)
        delete sendUser.hash
        return res.send({success: true, user: sendUser, passwordChanged:passwordModified})
    }
}

// Does everything bar password stuff. Each endpoint can handle THAT itself.
interface FieldError {
    field: keyof User,
    msg: string
}
async function userEdit (user: User, newInfo: any): Promise<FieldError[]> {
    const errors: FieldError[] = [];
    const {
        username,
        email,
        firstName,
        lastName,
    } = newInfo;
    if (username) {
        if (validUsername(username)) {
            user.username = trim(escape(username))
        } else {
            errors.push({field: "username", msg: "Username must be between 3 and 20 characters and contain only letters, numbers and the symbols \".\", \"-\" or \"_\"."})
        }
    }
    if (email) {
        if (isEmpty(email) || !isEmail(email)) {
            errors.push({field: "email", msg: "Invalid email: Please check it and try again."})
        } else {
            const normalised = normalizeEmail(email)
            if (normalised) {
                user.email = normalised
            } else {
                errors.push({field: "email", msg: "Invalid email: The email could not be normalised."})
            }
        }
    }

    if (firstName) {
        if (validRealName(firstName)) {
            user.firstName = trim(escape(firstName))
        } else {
            errors.push({field: "firstName", msg: "Invalid first name: Must be alphanumeric and under 30 characters."})
        }
    }
    if (lastName) {
        if (validRealName(lastName)) {
            user.lastName = trim(escape(lastName))
        } else {
            errors.push({field: "lastName", msg: "Invalid last name: Must be alphanumeric and under 30 characters."})
        }
    }

    if (username || email) {
        // Check they aren't taken.
        const existingUser = await Database.checkUserExists(username, email);
        if (existingUser && existingUser.id !== user.id) {
            errors.push({field: username?"username":"email", msg: `${username?"Username":"Email"} is already in use by another account.`})
        }
    }
    return errors;
}

users.patch('/:userId/groups', errorCatch(async (req: Request, res: Response) => {
    if (!req.user) throw new Error("No req.user on patch /:user/groups");
    const perms = getPerms(req.user);
    if (!perms.admin) {
        return res.status(403).send(errors.forbidden)
    }

    if (req.params.userId && !isEmpty(req.params.userId) && isNumeric(req.params.userId)) {
        const user = await Database.getUser(parseInt(req.params.userId, 10));
        if (user) {
            // Check permissions then modify it.
            if (req.body.groups && Array.isArray(req.body.groups)) {
                const validGroups: Group[] = [];

                for (let groupId of req.body.groups) {
                    if (groupId && typeof groupId === "number" && groupId > 0 && groupId < 2000) {
                        // now check if they actually map to a group
                        const group:undefined|Group = await Database.getGroup(groupId);
                        if (group) {
                            validGroups.push(group)
                        }
                    }
                }

                // validGroupsIds are safe, 100% ok

                user.groups = validGroups;
                await Database.users.save(user);
                res.send({success: true, message: `Successfully updated groups for ${user.username}.`});

            } else {
                return res.status(400).send(errorGenerator(400, "No groups provided."))
            }
        } else {
            res.status(404).send(errorGenerator(404, "User not found."))
        }
    }
}));


// For @me this should probably also request their password.
users.delete('/:userId', (_req, res) => res.status(501).send(errors.notImplemented));

users.get('/', errorCatch(async (_req: Request, res: Response): Promise<any> => {
    const users:Array<User> = await Database.getUsers()
    res.send({
        success: true,
        users
    })

}));



export default users

