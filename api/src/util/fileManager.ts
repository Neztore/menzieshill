// Manages the creation, removal and management of uploaded files.

// Each root has a folder.
import {validFileName, whitelistChars} from "./index";
import multer from 'multer';
import { filesLoc } from '../../config'
import { trim, whitelist } from 'validator'
import {randomBytes} from "crypto";
import { join } from 'path'
import { access, constants, unlink } from 'fs'

const getPath = (loc: string) => join(filesLoc, loc);

export function generateFileExtra (len: number): Promise<string> {
    return new Promise(function (resolve, reject) {
        randomBytes(len / 1.15, function(err, buffer) {
            if (err) {
                reject(err);
            }
            const token = buffer.toString('hex');
            resolve(whitelist(token.substr(0, len), whitelistChars))
        })
    })
}

const storage = multer.diskStorage({
    destination: filesLoc,
    filename: async function (_req, file, cb) {
        if (validFileName(file.originalname)) {
            const token = await generateFileExtra(5);
            const split = file.originalname.split('.');

            if (split.length !== 1 && !file.originalname.includes('..')) {
                const ext = split.splice(split.length - 1, 1)[0];
                const name = split.join(".");
                cb(null, `${trim(name)}-${token}.${ext}`)
            } else {
                // no file type attached
                cb(null, `${trim(file.originalname)}-${token}`)
            }

        } else {
            const token = await generateFileExtra(10);
            cb(null, `File-${token}`)
        }
    }
});

function removeFile (loc: string) {
    return new Promise(function (resolve, reject) {
        if (loc.includes('..')) {
            return reject("Illegal: loc includes '..'.")
        }
        const path = getPath(loc);

        // Test exists & deletable
        // Check if the file exists in the current directory, and if it is writable.
        access(path, constants.F_OK | constants.W_OK, (err) => {
            if (err) {
                return reject(err);
            } else {
                // Remove it
                unlink(path, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(true);
                });

            }
        });

    });
}

function  checkExists(loc: string) {
    return new Promise(function (resolve, _reject) {
        const path = getPath(loc);
        access(path, constants.R_OK, (err) => {
            if (err) {
                return resolve(false);
            } else {
                return resolve(true)
            }
        });
    })
}




export {
    storage,
    removeFile,
    checkExists,
    getPath
}