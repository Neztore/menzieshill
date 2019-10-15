// Authorisation middleware. Used on all routes that require a user to be logged in.
// Also manages the deletion of expired auth tokens, or an excessive number of them.
// Sets req.user to the user's User from the database.

// NOTE: Make sure u hide authorisation tokens on the user object set into req, we dont want any leaky leaky.

// Auth middleware verifies that the user is logged in and exists. Sets req.user so that permissions can be additionally verified.

import {errorGenerator, errors, hasPerms, Perms} from '../util';
import Database from '../db'
import { isEmpty, isLength } from "validator";
import {NextFunction, Request, Response} from "express";
import { authLife } from '../../config'



function makeMiddleware (requiredPerms?: Perms[]) {
    return async function checkAuth (req: Request, res: Response, next: NextFunction) {
        // For if auth is done, we're just checking member
        if (req.user && requiredPerms) {
            if (!hasPerms(req.user, requiredPerms)) {
                res.status(errors.unauthorized.error.status);
                return res.send(errors.forbidden)
            } else {
                return next()
            }
        }

        if (!req.cookies || !req.cookies.token || isEmpty(req.cookies.token) || !isLength(req.cookies.token, {min: 100, max: 100})) {
            res.status(errors.unauthorized.error.status);
            return res.send(errors.unauthorized)
        } else {
            // An authorization token has been supplied. Verify it.
            const auth = await Database.getAuthByToken(req.cookies.token);
            if (!auth) {
                // Invalid auth token.
                res.status(403);
                res.send(errorGenerator(403, 'Forbidden: Invalid authorisation token.'))
            } else {
                // User exists. Set it and move on.
                // Check auth age
                const oldest = auth.created.getTime() + (authLife * 1000);
                if (oldest < Date.now()) {
                    // It's expired.
                    await Database.deleteAuth(auth);
                    res.status(401).send(errorGenerator(401, "Token expired, please login again.", {action: "login"}));
                }
                // Check if it's member only
                if (auth.user && requiredPerms) {
                    if (!hasPerms(auth.user, requiredPerms)) {
                        res.status(errors.unauthorized.error.status);
                        return res.send(errors.forbidden)
                    }
                }
                req.user = auth.user;
                next()
            }

        }
    }
}



export default makeMiddleware