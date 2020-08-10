import { Request, Response, Router } from "express";
import { isEmpty, isInt, trim } from "validator";

import Database from "../db";
import { Group } from "../db/entity/Group.entity";
import checkAuth from "../middleware/auth";
import {
  errorCatch, errorGenerator, Perms, validName
} from "../util";

// import Database from '../db/index'

const groups = Router();

groups.use(checkAuth([Perms.member]));

// Get all groups
groups.get("/", errorCatch(async (_req: Request, res:Response) => {
  const grps = await Database.getGroups();
  res.send(grps);
}));

// Admin only
groups.use(checkAuth([Perms.admin]));

// Create group
groups.post("/", errorCatch(async (req: Request, res:Response) => {
  const newGroup = new Group();

  const editedGroup = modifyGroup(newGroup, req.body);

  if (!editedGroup.name) {
    res.status(400).send(errorGenerator(400, "Group name must be between 3 and 20 characters and contain only letters, numbers and the symbols \".\", \"-\" or \"_\"."));
  } else {
    // Even if all those bools are bad/not there, the group can still be made.
    await Database.modifyGroup(editedGroup);
    res.send({
      message: `Successfully created group ${editedGroup.name}!`,
      success: true,
      editedGroup
    });
  }
}));

// Delete group
groups.delete("/:id", errorCatch(async (req: Request, res:Response) => {
  if (req.params.id && !isEmpty(req.params.id) && isInt(req.params.id)) {
    const group = await Database.getGroup(parseInt(req.params.id, 10));
    if (group) {
      await Database.deleteGroup(group);
      res.send({
        success: true,
        message: `Successfully deleted group ${group.name}.`
      });
    } else {
      res.status(400).send(errorGenerator(400, "Bad group id."));
    }
  }
}));

// Edit group
groups.patch("/:id", errorCatch(async (req: Request, res:Response) => {
  if (req.params.id && !isEmpty(req.params.id) && isInt(req.params.id)) {
    const currentGroup = await Database.getGroup(parseInt(req.params.id, 10));
    if (currentGroup) {
      const editedGroup = modifyGroup(currentGroup, req.body);
      await Database.modifyGroup(editedGroup);
      return res.send({
        message: `Successfully edited group ${editedGroup.name}!`,
        success: true,
        editedGroup
      });
    }
    return res.status(400).send(errorGenerator(400, "Group not found."));
  }
  return res.status(400).send(errorGenerator(400, "Bad group id."));
}));

function modifyGroup (group: Group, body: any): Group {
  const newGroup: Group = { ...group };
  if (validName(body.name)) {
    newGroup.name = trim(body.name);
  }

  if (validPerm(body.admin)) {
    newGroup.admin = body.admin;
  }
  if (validPerm(body.member)) {
    newGroup.member = body.member;
  }
  if (validPerm(body.managePosts)) {
    newGroup.managePosts = body.managePosts;
  }
  if (validPerm(body.manageEvents)) {
    newGroup.manageEvents = body.manageEvents;
  }
  if (validPerm(body.manageFiles)) {
    newGroup.manageFiles = body.manageFiles;
  }
  if (validPerm(body.managePages)) {
    newGroup.managePages = body.managePages;
  }

  if (validPerm(body.joinable)) {
    newGroup.joinable = body.joinable;
  }
  return newGroup;
}

const validPerm = (p:any) => p !== undefined && typeof p === "boolean";
export default groups;
