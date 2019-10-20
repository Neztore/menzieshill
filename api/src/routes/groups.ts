import {Request, Response, Router} from "express";
import {errorCatch, errorGenerator, Perms, validName} from '../util'
import checkAuth from "../middleware/auth";
import Group from "../db/entity/Group.entity";
import Database from '../db'

import { trim, isInt, isEmpty } from 'validator'

//import Database from '../db/index'

const groups = Router();

groups.use(checkAuth([Perms.Member]));

// Get all groups
groups.get('/', errorCatch(async (_req: Request, res:Response) => {
    res.send(await Database.getGroups())
}));

// Admin only
groups.use(checkAuth([Perms.Admin]));

// Create group
groups.post('/', errorCatch(async (req: Request, res:Response) => {
        const newGroup = new Group();

        modifyGroup(newGroup, req.body);

        if (!newGroup.name) {
            return res.status(400).send(errorGenerator(400, "Group name must be between 3 and 20 characters and contain only letters, numbers and the symbols \".\", \"-\" or \"_\"."))
        }
        // Even if all those bools are bad/not there, the group can still be made.
        await Database.modifyGroup(newGroup);
        res.send({message: `Successfully created group ${newGroup.name}!`, success: true, newGroup})

}));

// Delete group
groups.delete('/:id', errorCatch(async (req: Request, res:Response) => {
    if (req.params.id && !isEmpty(req.params.id) && isInt(req.params.id)) {
        const group = await Database.getGroup(parseInt(req.params.id));
        if (group) {
            await Database.deleteGroup(group);
            res.send({success: true, message: `Successfully deleted group ${group.name}.`})
        } else {
            res.status(400).send(errorGenerator(400, "Bad group id."))
        }
    }
}));

// Edit group
groups.patch('/:id', errorCatch(async (req: Request, res:Response) => {
    if (req.params.id && !isEmpty(req.params.id) && isInt(req.params.id)) {
        const group = await Database.getGroup(parseInt(req.params.id, 10));
        if (group) {
            modifyGroup(group, req.body);
            await Database.modifyGroup(group);
            res.send({message: `Successfully edited group ${group.name}!`, success: true, group})
        } else {
            return res.status(400).send(errorGenerator(400, "Group not found."))
        }
    } else {
        res.status(400).send(errorGenerator(400, "Bad group id."))
    }
}));

function  modifyGroup(group: Group, body: any) {
    if (validName(body.name)) {
        group.name = trim(body.name)
    }

    if (validPerm(body.admin)) {
        group.admin = body.admin
    }
    if (validPerm(body.member)) {
        group.member = body.member
    }
    if (validPerm(body.managePosts)) {
        group.managePosts= body.managePosts
    }
    if (validPerm(body.manageEvents)) {
        group.manageEvents = body.manageEvents
    }
    if (validPerm(body.manageFiles)) {
        group.manageFiles = body.manageFiles
    }
    if (validPerm(body.managePages)) {
        group.managePages = body.managePages
    }

    if (validPerm(body.joinable)) {
        group.joinable = body.joinable
    }
    return group
}




const validPerm = (p:any) => p !== undefined && typeof p === "boolean";
export default groups