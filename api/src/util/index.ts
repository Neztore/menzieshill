// Some shared things
import { randomBytes } from "crypto";
import fetch from "node-fetch";
import {
  escape, isAscii, isEmpty, isInt, isLength, isWhitelisted, stripLow, trim
} from "validator";
import isAlpha from "validator/lib/isAlpha";

import { recaptchaToken } from "../../config";
import { Group, Permission } from "../db/entity/Group.entity";
import { User } from "../db/entity/User.entity";
import {
  errorCatch, errorGenerator, errorHandler, errors
} from "./errors";

// Len: length in letters.
function generateToken (): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(80, (err, buffer) => {
      if (err) {
        reject(err);
      }
      const token = buffer.toString("base64");
      resolve(token.substr(0, 100));
    });
  });
}

const whitelistChars = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-_`;

function getPerms (user: User, override?: boolean) {
  // We've already found this in the past.
  if (user.perm && !override) return user.perm;

  const userPermission = new Permission();
  if (!user.groups) {
    console.error(`User passed to checkAdmin without groups. Assuming none.`);
    return userPermission;
  }
  for (const grp of user.groups) {
    // I tried to use a loop. It failed, a lot.
    if (grp.admin) userPermission.admin = true;
    if (grp.manageEvents) userPermission.manageEvents = true;
    if (grp.manageFiles) userPermission.manageFiles = true;
    if (grp.managePosts) userPermission.managePosts = true;
    if (grp.member) userPermission.member = true;
  }
  // eslint-disable-next-line no-param-reassign
  user.perm = userPermission;
  return userPermission;
}

function hasGroups (user: User | undefined, requiredGroups: Group[]): boolean {
  if (!user && requiredGroups.length === 0) {
    return true;
    // They aren't logged in.
  } if (!user && requiredGroups.length !== 0) {
    return false;
  } if (user) {
    for (const required of requiredGroups) {
      let found = false;
      let counter = 0;

      while (!found && counter < user.groups.length) {
        if (user.groups[counter].id === required.id) {
          found = true;
        }
        // TODO: Make sure this doesn't conflict with future stuff e.g notifications
        if (user.groups[counter].admin) {
          return true; // technically not true, but they're an admin so who cares.
        }
        counter++;
      }
      if (!found) {
        // They don't have it.
        return false;
      }
    }
    // We made it here. They have them all.
    return true;
  }
  return false;
}

enum Perms {
    admin = "admin",
    managePosts = "managePosts",
    member = "member",
    manageEvents = "manageEvents",
    manageFiles = "manageFiles"
}

function hasPerms (user: User, requiredPerms: Perms[]) {
  const userPerms = getPerms(user);
  if (userPerms.admin) return true;
  for (const required of requiredPerms) {
    if (!userPerms[required]) {
      return false;
    }
  }
  return true;
}

// Name does both user and group names.
const validUsername = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, whitelistChars) && isLength(username, {
  min: 3,
  max: 30
});
const validName = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, `${whitelistChars} ()!`) && isLength(username, {
  min: 3,
  max: 100
});
const validRealName = (username: string|undefined) => username && !isEmpty(username) && isAlpha(username) && isLength(username, {
  min: 1,
  max: 30
});
const validFileName = (username: string|undefined) => username && !isEmpty(username) && isWhitelisted(username, `${whitelistChars} '()!`) && isLength(username, {
  min: 1,
  max: 80
});
const validPassword = (password: string|undefined) => password && !isEmpty(password) && isAscii(password) && isLength(password, {
  min: 8,
  max: 50
});
const validId = (id: string|undefined) => id && !isEmpty(id) && isInt(id) && parseInt(id, 10) > 0;
const validString = (username: string|undefined, length?: number) => {
  if (length) {
    return username && !isEmpty(username) && isLength(username, {
      min: 3,
      max: length || 0
    });
  } return username && !isEmpty(username);
};

async function checkRecaptcha (token: string): Promise<boolean|string> {
  const res = await post(`https://www.google.com/recaptcha/api/siteverify`, { // recaptchaToken
    body: {
      secret: recaptchaToken,
      response: token
    }
  });
  return res.success;
}

function post (url:string, opt:any) {
  const options = opt ? { ...opt } : {};
  options.method = "POST";
  // POST Body processing
  if (options.body && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
    if (!options.headers) options.headers = {};
    options.headers["Content-Type"] = "application/json";
  }
  return makeRequest(url, options);
}

async function makeRequest (url: string, options: any) {
  const req = await fetch(url, options);
  return req.json();
}

const cleanString = (str: string): string => escape(stripLow(trim(str), true));
export type RootString = "archive"|"photos"|"docs"|"content"

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
  makeRequest,
  post

};
