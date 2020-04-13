// Some shared things
import {errorCatch, errorGenerator, errorHandler, errors} from "./errors";
import {randomBytes} from "crypto";
import User from "../db/entity/User.entity";
import {escape, isAscii, isEmpty, isInt, isLength, isWhitelisted, stripLow, trim} from "validator";
import Group, {Permission} from "../db/entity/Group.entity";
import fetch from 'node-fetch'
import { recaptchaToken } from '../../config'
import isAlpha from "validator/lib/isAlpha";

// Len: length in letters.
function generateToken (): Promise<string> {
    return new Promise(function (resolve, reject) {
        randomBytes(80, function(err, buffer) {
            if (err) {
                reject(err);
            }
            const token = buffer.toString('base64');
            resolve(token.substr(0, 100))
        })
    })
}


const whitelistChars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_`;

function getPerms (User: User, override?: boolean) {
    // We've already found this in the past.
    if (User.perm&& !override) return User.perm;

    const userPermission = new Permission();
    if (!User.groups) {
        console.error(`User passed to checkAdmin without groups. Assuming none.`);
        return userPermission
    }
    for (let grp of User.groups) {


        // I tried to use a loop. It failed, a lot.
        if (grp.admin) userPermission.admin = true;
        if (grp.manageEvents) userPermission.manageEvents = true;
        if (grp.manageFiles) userPermission.manageFiles = true;
        if (grp.managePosts) userPermission.managePosts = true;
        if (grp.managePages) userPermission.managePages = true;
        if (grp.member) userPermission.member = true
    }
    User.perm = userPermission;
    return userPermission
}

function hasGroups(user: User | undefined, requiredGroups: Group[]): boolean {
    if (!user && requiredGroups.length === 0) {
        return true
        // They aren't logged in.
    } else if (!user && requiredGroups.length !== 0) {
        return false
    } else if (user) {
        for (const required of requiredGroups) {
            let found = false;
            let counter = 0;

            while (!found && counter < user.groups.length) {
                if (user.groups[counter].id === required.id) {
                    found = true
                }
                if (user.groups[counter].admin) {
                    return true // technically not true, but they're an admin so who cares. //TODO: Make sure this doesn't conflict with future stuff e.g notifications
                }
                counter++
            }
            if (!found) {
                // They don't have it.
                return false
            }
        }
        // We made it here. They have them all.
        return true
    } else {
        return false
    }
}

enum Perms {
    Admin = "admin",
    ManagePosts = "managePosts",
    Member = "member",
    ManagePages = "managePages",
    ManageEvents = "manageEvents",
    ManageFiles = "manageFiles"
}


function hasPerms(user: User, requiredPerms:  Perms[]) {
    const userPerms = getPerms(user);
    if (userPerms.admin) return true;
    for (const required of requiredPerms) {
        if (!userPerms[required]) {
            return false
        }
    }
    return true
}


// Name does both user and group names.
const validUsername = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, whitelistChars) && isLength(username, { min: 3, max: 30 });
const validName = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, whitelistChars + " ()!") && isLength(username, { min: 3, max: 30 });
const validRealName = (username: string|undefined) => username && !isEmpty(username) && isAlpha(username) && isLength(username, { min: 1, max: 30 });
const validFileName = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, whitelistChars + " '()!") && isLength(username, { min: 1, max: 80 });
const validPassword = (password: string|undefined) => password && !isEmpty(password) && isAscii(password) && isLength(password, { min: 8, max: 50 });
const validId = (id: string|undefined) => id && !isEmpty(id) && isInt(id) && parseInt(id, 10) > 0;
const validString = (username: string|undefined, length?: number) => { if (length) {
    return username && !isEmpty(username) && isLength(username, { min: 3, max: length || 0 })
} else return username && !isEmpty(username);
};


async function checkRecaptcha(token: string): Promise<boolean|string> {
    const res = await  post(`https://www.google.com/recaptcha/api/siteverify`, { //recaptchaToken
        body: {
            secret: recaptchaToken,
            response: token
        }
    });
    return res.success;

}


function post(url:string, options:any) {
        if (!options) options = {};
        options.method = "POST";
        // POST Body processing
        if (options.body && typeof options.body !== "string") {
            options.body = JSON.stringify(options.body);
            if (!options.headers) options.headers = {};
            options.headers["Content-Type"] = "application/json"
        }
        return makeRequest(url, options)
}


async function makeRequest(url: string, options: any) {
    const req = await fetch(url, options);
    return await req.json()
}



const cleanString = (str: string): string=> {
    return escape(stripLow(trim(str), true))
};
type RootString = "archive"|"photos"|"docs"

export {
    errorHandler,
    errorCatch,
    errors,
    errorGenerator,
    generateToken,
    whitelistChars,
    getPerms,
    Perms,
    hasPerms,
    hasGroups,
    checkRecaptcha,

    validName,
    validPassword,
    validUsername,
    cleanString,
    validId,
    validString,
    validFileName,
    validRealName,
    RootString,
    makeRequest,
    post

}

