import express, { Request, Response } from "express";
import { writeFile } from "fs";
import multer from "multer";
import { join } from "path";
import { isEmpty, isLength, trim } from "validator";

import { filesLoc } from "../../config";
import Database from "../db";
import { File } from "../db/entity/File.entity";
import { Folder } from "../db/entity/Folder.entity";
import { Group } from "../db/entity/Group.entity";
import { User } from "../db/entity/User.entity";
import auth from "../middleware/auth";
import {
  errorCatch,
  errorGenerator,
  errors as Errors,
  hasGroups,
  Perms,
  RootString,
  validFileName,
  validId,
  validName, validString
} from "../util";
import { generateStatic, rebuildFolder } from "../util/contentManager";
import {
  checkExists, generateFileExtra, getPath, removeFile, storage
} from "../util/fileManager";

export const roots = ["archive", "docs", "photos", "content"];

const files = express.Router();

files.use(async (req, _res, next) => {
  if (req.cookies && req.cookies.token && !isEmpty(req.cookies.token) && isLength(req.cookies.token, {
    min: 100,
    max: 100
  })) {
    // An authorization token has been supplied. Verify it.
    const userAuth = await Database.getAuthByToken(req.cookies.token);
    if (userAuth) {
      req.user = userAuth.user;
    }
  }
  next();
});

files.get("/photos", errorCatch(async (req: Request, res: Response): Promise<any> => {
  const folder = await Database.getFolderRoot("photos");
  checkChildrenPermissions(folder, req.user);
  res.send(folder);
}));

files.get("/archive", errorCatch(async (req: Request, res: Response): Promise<any> => {
  const folder = await Database.getFolderRoot("archive");
  checkChildrenPermissions(folder, req.user);
  res.send(folder);
}));

files.get("/docs", errorCatch(async (req: Request, res: Response): Promise<any> => {
  const folder = await Database.getFolderRoot("docs");
  checkChildrenPermissions(folder, req.user);
  res.send(folder);
}));
files.get("/content", errorCatch(async (req: Request, res: Response): Promise<any> => {
  const folder = await Database.getFolderRoot("content");
  checkChildrenPermissions(folder, req.user);
  res.send(folder);
}));

// Get folder
files.get("/:folderId", errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (validId(req.params.folderId)) {
    const folder = await Database.getFolder(parseInt(req.params.folderId, 10));
    if (folder) {
      const accessInfo = await canAccessFolder(req.user, folder);
      if (accessInfo.hasAccess) {
        // They can get the folder. Now we check children.
        // Shows the different ways this can be called.
        checkChildrenPermissions(folder, req.user);

        return res.send({
          ...folder,
          path: accessInfo.path
        });
      }
      return res.status(Errors.forbidden.error.status).send(Errors.forbidden);
    }
    return res.status(400).send(errorGenerator(400, "Invalid folder id."));
  }
  return res.status(400).send(errorGenerator(400, "Bad folder id."));
}));

// Get file
files.get("/:parent/:loc", errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (validFileName(req.params.loc)) {
    const file = await Database.getFile(req.params.loc);
    if (file) {
      if (!await canAccessFile(req.user, file)) return res.status(Errors.forbidden.error.status).send(errorGenerator(Errors.forbidden.error.status, "You do not have access to that file."));
      const exists = await checkExists(file.loc);
      if (exists) {
        const path = getPath(file.loc);
        return res.sendFile(path);
      }
      throw new Error(`Image file not found for file ${file.loc}`);
    } else {
      return res.status(400).send(errorGenerator(400, "Invalid file loc."));
    }
  } else {
    return res.status(400).send(errorGenerator(400, "Invalid file loc."));
  }
}));

files.use(auth([Perms.manageFiles]));
// Create folder
files.post("/:parent", errorCatch(async (req: Request, res: Response): Promise<any> => {
  let parent;
  if (roots.includes(req.params.parent)) {
    parent = await Database.getFolderRoot(<RootString>req.params.parent);
  } else if (validId(req.params.parent)) {
    const par = await Database.getFolder(parseInt(req.params.parent, 10));
    if (par) {
      parent = par;
    } else {
      return res.status(400).send(errorGenerator(400, "Invalid parent id."));
    }
  }

  // It will be
  if (parent) {
    const accessInfo = await canAccessFolder(req.user, parent);
    if (!accessInfo.hasAccess) return res.status(Errors.forbidden.error.status).send(errorGenerator(Errors.forbidden.error.status, "You do not have access to parent folder."));
    const newFolder = new Folder();
    await modifyItem(newFolder, req.body);

    if (!newFolder.name) {
      return res.status(400).send(errorGenerator(400, `Invalid folder name.`));
    }
    await Database.addFolder(parent, newFolder);
    rebuildFolder(newFolder);
    return res.send({
      success: true,
      newFolder: {
        name: newFolder.name,
        accessGroups: newFolder.accessGroups,
        id: newFolder.id,
        created: newFolder.created
      }
    });
  }
  throw new Error("No Parent");
}));

// Delete & Edit folder
files.patch("/:folderId", errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (validId(req.params.folderId)) {
    const folder = await Database.getFolder(parseInt(req.params.folderId, 10));
    if (folder) {
      const accessInfo = await canAccessFolder(req.user, folder);
      if (!accessInfo.hasAccess) return res.status(Errors.forbidden.error.status).send(Errors.forbidden);
      const errors = await modifyItem(folder, req.body);
      if (errors && errors.length !== 0) {
        return res.status(400).send(errorGenerator(400, "Bad folder parameters", { errors }));
      }
      await Database.saveFolder(folder);
      rebuildFolder(folder);
      return res.send({
        success: true,
        folder,
        message: "Successfully modified folder."
      });
    }
    return res.status(400).send(errorGenerator(400, "Invalid folder id."));
  }
  return res.status(400).send(errorGenerator(400, "Invalid folder id."));
}));

files.delete("/:folderId", errorCatch(async (req: Request, res: Response): Promise<any> => {
  let folder;
  if (roots.includes(req.params.folderId)) {
    folder = await Database.getFolderRoot(<RootString>req.params.folderId);
  } else if (validId(req.params.folderId)) {
    folder = await Database.getFolder(parseInt(req.params.folderId, 10));
  } else {
    return res.status(400).send(errorGenerator(400, "Invalid folder id."));
  }

  if (folder) {
    const accessInfo = await canAccessFolder(req.user, folder);
    if (!accessInfo.hasAccess) return res.status(Errors.forbidden.error.status).send(Errors.forbidden);
    // Iterate and delete children
    const promises = [];
    for (const child of folder.files) {
      promises.push(deleteFile(child));
    }
    await Promise.all(promises);

    // All 'real' files are gone. Remove folder too.
    const r = await Database.deleteFolder(folder);
    if (r === false) {
      return res.send({
        success: false,
        error: {
          status: 0,
          message: "Only empty folders can be deleted. Please empty it first."
        }
      });
    }
    generateStatic().catch(console.error);
    return res.send({
      success: true,
      message: "Folder removed."
    });
  }
  return res.status(400).send(errorGenerator(400, "Invalid folder id."));
}));

// Upload file
const upload = multer({ storage });
// Add file.
files.post("/:parent/files", upload.array("files", 200), errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (req.params.parent && req.user) {
    let parent;
    if (validId(req.params.parent)) {
      parent = await Database.getFolder(parseInt(req.params.parent, 10));
    } else if (roots.includes(req.params.parent)) {
      parent = await Database.getFolderRoot(<RootString>req.params.parent);
    } else {
      return res.status(400).send(errorGenerator(400, "Bad parent resource id."));
    }
    if (parent) {
      const accessInfo = await canAccessFolder(req.user, parent);
      if (!accessInfo.hasAccess) return res.status(Errors.forbidden.error.status).send(errorGenerator(Errors.forbidden.error.status, "You do not have access to parent folder."));
      // We're good. Create file associations for the files.
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const promises: Promise<any>[] = [];
        for (const file of req.files) {
          // Create files
          promises.push(handleFile(file, parent, req.user.id));
        }
        await Promise.all(promises);
        await Database.saveFolder(parent);
        rebuildFolder(parent);
        return res.send({
          success: true,
          message: `Uploaded ${promises.length} files.`
        });
      } if (req.files) {
        // It's a single file.
        await handleFile(req.files, parent, req.user.id);
        await Database.saveFolder(parent);
        rebuildFolder(parent);
        return res.send({
          success: true,
          message: `Uploaded 1 file.`
        });
      }
      return res.status(400).send(errorGenerator(400, "No files included."));
    }
    return res.status(404).send("Parent resource not found.");
  }
  return res.status(400).send(errorGenerator(400, "Bad request"));
}));
// Save new file
async function handleFile (file: any, parent: Folder, creatorId: number) {
  const dbFile = new File();
  if (validFileName(file.originalname)) {
    const split = file.originalname.split(".");

    // remove extension if exists
    if (split.length !== 1) {
      split.splice(split.length - 1, 1);
      dbFile.name = trim(split.join("."));
    } else {
      dbFile.name = trim(file.originalname);
    }
  } else {
    dbFile.name = `New-file-${await generateFileExtra(10)}`;
  }

  // Set by storage function
  dbFile.loc = file.filename;
  dbFile.creator = { id: creatorId };
  // eslint-disable-next-line no-param-reassign
  if (!parent.files) parent.files = [];
  parent.files.push(dbFile);
  await Database.saveFile(dbFile);
  return parent;
}

// Edit metadata
files.patch("/:parent/files/:loc", errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (validFileName(req.params.loc)) {
    const file = await Database.getFile(req.params.loc);
    if (file) {
      if (!await canAccessFile(req.user, file)) return res.status(Errors.forbidden.error.status).send(errorGenerator(Errors.forbidden.error.status, "You do not have access to that file."));
      const errors = await modifyItem(file, req.body);
      if (errors && errors.length !== 0) {
        return res.status(400).send(errorGenerator(400, "Bad file options.", { errors }));
      }
      rebuildFolder(file.folder);
      await Database.saveFile(file);
      return res.send({
        success: true,
        file
      });
    }
    return res.status(404).send(errorGenerator(404, "File not found"));
  }
  return res.status(400).send(errorGenerator(400, "Invalid file loc."));
}));

// Edit Content: Only for text-based
files.patch("/:parent/files/:loc/content", errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (validFileName(req.params.loc)) {
    const file = await Database.getFile(req.params.loc);
    if (file) {
      if (!await canAccessFile(req.user, file)) return res.status(Errors.forbidden.error.status).send(errorGenerator(Errors.forbidden.error.status, "You do not have access to that file."));
      if (req.body.name && validName(req.body.name)) {
        file.name = req.body.name;
        await Database.saveFile(file);
      }
      if (req.body.content && validString(req.body.content)) {
        return writeFile(join(filesLoc, file.loc), req.body.content, e => {
          if (e) {
            console.error(e.message);
            throw new Error(e.message);
          }
          // Trigger re-build
          rebuildFolder(file.folder);
          return res.send({ success: true });
        });
      }
      return res.status(400).send(errorGenerator(400, "Bad request: You must supply content."));
    }
    return res.status(404).send(errorGenerator(404, "File not found"));
  }
  return res.status(400).send(errorGenerator(400, "Invalid file loc."));
}));

// Delete file
files.delete("/:parent/:loc", errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (validFileName(req.params.loc)) {
    const file = await Database.getFile(req.params.loc);
    if (file) {
      if (!await canAccessFile(req.user, file)) return res.status(Errors.forbidden.error.status).send(errorGenerator(Errors.forbidden.error.status, "You do not have access to that file."));
      const folder = { ...file.folder };
      await Database.deleteFile(file);
      rebuildFolder(folder);
      return res.send({
        success: true,
        message: "File deleted"
      });
    }
    return res.status(400).send(errorGenerator(400, "Invalid file loc."));
  }
  return res.status(400).send(errorGenerator(400, "Invalid file loc."));
}));

// Get meta data
files.get("/:parent/files/:loc/info", errorCatch(async (req: Request, res: Response): Promise<any> => {
  if (validFileName(req.params.loc)) {
    const file = await Database.getFile(req.params.loc);
    if (file) {
      if (!await canAccessFile(req.user, file)) return res.status(Errors.forbidden.error.status).send(errorGenerator(Errors.forbidden.error.status, "You do not have access to that file."));
      return res.send(file);
    }
    return res.status(400).send(errorGenerator(400, "Invalid file loc."));
  }
  return res.status(400).send(errorGenerator(400, "Invalid file loc."));
}));

async function deleteFile (file: File) {
  await removeFile(file.loc);
  await Database.deleteFile(file);
}

async function modifyItem (folder: Folder|File, body: any) {
  const errors: string[] = [];
  if (body.name) {
    if (validName(body.name) && trim(body.name) !== "") {
      // eslint-disable-next-line no-param-reassign
      folder.name = trim(body.name);
    } else {
      errors.push(`Invalid item name.`);
    }
  }

  if (body.accessGroups && Array.isArray(body.accessGroups)) {
    const validGroups: Group[] = [];

    for (const groupId of body.accessGroups) {
      if (groupId && typeof groupId === "number" && groupId > 0 && groupId < 2000) {
        // now check if they actually map to a group
        // eslint-disable-next-line no-await-in-loop
        const group:undefined|Group = await Database.getGroup(groupId);
        if (group) {
          validGroups.push(group);
        } else {
          errors.push(`Invalid group: ${groupId}`);
        }
      } else {
        errors.push(`Invalid group: ${groupId}`);
      }
    }
    // eslint-disable-next-line no-param-reassign
    folder.accessGroups = validGroups;
  }
  return errors;
}
// TODO: Add admin check - Admins can access all files.
interface accessResult {
  hasAccess: boolean,
  path?: Partial<Folder>[]
}

async function canAccessFile (user: User|undefined, file: File): Promise<accessResult> {
  if (hasGroups(user, file.accessGroups)) {
    return canAccessFolder(user, file.folder);
  } return { hasAccess: false };
}

async function canAccessFolder (user: User|undefined, folder: Folder): Promise<accessResult> {
  if (!folder.accessGroups) {
    const fetched = await Database.getFolder(folder.id);
    if (fetched) {
      // eslint-disable-next-line no-param-reassign
      folder = fetched;
    } else {
      throw new Error("Failed to navigate tree for parent permissions.");
    }
  }
  if (hasGroups(user, folder.accessGroups)) {
    // They can on THIS item. Check parents.
    const parents = await Database.getFolderParents(folder);
    for (const parent of parents) {
      if (!hasGroups(user, parent.accessGroups)) {
        return { hasAccess: false };
      }
    }
    // we made it here. they're ok
    const path = parents.map(({ id, name }) => ({
      id,
      name
    }));
    return {
      hasAccess: true,
      path
    };
  } return { hasAccess: false };
}

interface DeniedFolder {
    name: string,
    hasAccess: boolean,
    created: Date
}

function checkChildrenPermissions (folder: Folder, user: User | undefined) {
    function checkItemsAccess(items: Array<File>): Array<File>
    function checkItemsAccess(items: Array<Folder>): Array<Folder>
    function checkItemsAccess (items: Array<File|Folder>): Array<File|Folder|DeniedFolder> {
      const returnArr = [];
      if (items && Array.isArray(items)) {
        for (const item of items) {
          if (hasGroups(user, item.accessGroups)) {
            returnArr.push(item);
          } else {
            returnArr.push({
              name: item.name,
              hasAccess: false,
              created: item.created
            });
          }
        }
      }
      return returnArr;
    }

    const children = checkItemsAccess(folder.children);
    const folderFiles = checkItemsAccess(folder.files);

    // eslint-disable-next-line no-param-reassign
    folder.children = children;
    // eslint-disable-next-line no-param-reassign
    folder.files = folderFiles;
}

export default files;
