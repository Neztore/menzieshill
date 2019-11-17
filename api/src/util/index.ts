// Some shared things
import {errorCatch, errorHandler, errors, errorGenerator} from "./errors";
import { randomBytes } from "crypto";
import User from "../db/entity/User.entity";
import {isAscii, isEmpty, isLength, isWhitelisted, trim, stripLow, escape} from "validator";
import Group, {Permission} from "../db/entity/Group.entity";
import isInt = require("validator/lib/isInt");

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
    userPermission.admin = true;
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
        // They aren't logged in. gtfo.
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
const validName = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, whitelistChars + " ") && isLength(username, { min: 3, max: 30 });
const validFileName = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, whitelistChars + " ") && isLength(username, { min: 1, max: 30 });
const validPassword = (password: string|undefined) => password && !isEmpty(password) && isAscii(password) && isLength(password, { min: 8, max: 50 });
const validId = (id: string|undefined) => id && !isEmpty(id) && isInt(id) && parseInt(id, 10) > 0;
const validString = (username: string|undefined, length?: number) => { if (length) {
    return username && !isEmpty(username) && isLength(username, { min: 3, max: length || 0 })
} else return username && !isEmpty(username);
};


const cleanString = (str: string)=> {
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

    validName,
    validPassword,
    validUsername,
    cleanString,
    validId,
    validString,
    validFileName,
    RootString

}

