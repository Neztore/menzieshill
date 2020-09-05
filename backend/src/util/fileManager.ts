// Manages the creation, removal and management of uploaded files.

// Each root has a folder.
import { randomBytes } from "crypto";
import { access, constants, unlink } from "fs";
import multer from "multer";
import { join } from "path";
import { trim, whitelist } from "validator";

import { filesLoc } from "../../config";
import { validFileName, whitelistChars } from "./index";

const getPath = (loc: string) => join(filesLoc, loc);

export function generateFileExtra (len: number): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(len, (err, buffer) => {
      if (err) {
        reject(err);
      }
      const token = buffer.toString("hex");
      resolve(whitelist(token.substr(0, len), whitelistChars));
    });
  });
}

const storage = multer.diskStorage({
  destination: filesLoc,
  async filename (_req, file, cb) {
    if (validFileName(file.originalname)) {
      const token = await generateFileExtra(5);
      const split = file.originalname.split(".");

      if (split.length !== 1 && !file.originalname.includes("..")) {
        const ext = split.splice(split.length - 1, 1)[0];
        const name = split.join(".");
        cb(null, `${trim(name)}-${token}.${ext}`);
      } else {
        // no file type attached
        cb(null, `${trim(file.originalname)}-${token}`);
      }
    } else {
      const token = await generateFileExtra(10);
      cb(null, `File-${token}`);
    }
  }
});

function removeFile (loc: string) {
  return new Promise((resolve, reject) => {
    if (loc.includes("..")) {
      return reject("Illegal: loc includes '..'.");
    }
    const path = getPath(loc);

    // Test exists & deletable
    // Check if the file exists in the current directory, and if it is writable.
    // eslint-disable-next-line no-bitwise
    return access(path, constants.F_OK | constants.W_OK, err => {
      if (err) {
        return reject(err);
      }
      // Remove it
      return unlink(path, e => {
        if (e) {
          return reject(e);
        }
        return resolve(true);
      });
    });
  });
}

function checkExists (loc: string) {
  return new Promise((resolve, _reject) => {
    const path = getPath(loc);
    access(path, constants.R_OK, err => {
      if (err) {
        return resolve(false);
      }
      return resolve(true);
    });
  });
}

export {
  storage,
  removeFile,
  checkExists,
  getPath
};
