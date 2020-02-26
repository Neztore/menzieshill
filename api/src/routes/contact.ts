import express, {Request, Response} from "express";

import {isEmail, normalizeEmail} from 'validator';

import {
    cleanString,
    errorCatch,
    errorGenerator, validName,
    validString,

} from '../util'

import EmailSystem from "../util/email";

const contact = express.Router();
const subjects = {
    "General": "secretary@menzieshillwhitehall.co.uk",
    "Welfare concern": "wpo@menzieshillwhitehall.co.uk",
    "Website issue": "admin@menzieshillwhitehall.co.uk"
};

// UserEntity ID should be either a valid userId string or @me
contact.post('/', errorCatch(async (req: Request, res:Response) => {
   const {
       name,
       email,
       text,
       subject
   } = req.body;

    const valid:any = {}
    if (validName(name)) {
        valid.name = cleanString(name)
    } else {
        return res.status(400).send(errorGenerator(400, "Name is required and must be valid."))
    }
    if (email && isEmail(email)) {
        valid.email = normalizeEmail(email)
    } else {
        return res.status(400).send(errorGenerator(400, "Email is required and must be valid."))
    }
    if (validString(text, 1000)) {
        valid.text = cleanString(text)
    } else {
        return res.status(400).send(errorGenerator(400, "Text is required and must be valid, and under 1000 characters."))
    }
    if (validString(subject)) {
        // @ts-ignore
        if (subjects[subject]) {
            valid.subject = subject
            //@ts-ignore
        } else {
            valid.subject = "General"
        }

    } else {
            return res.status(400).send(errorGenerator(400, "Subject  is required and must be valid."))
        }

    // We got here, so it's valid.
    //@ts-ignore
    const to = subjects[valid.subject];

    const sent = await EmailSystem.send('contactUs',[to, valid.email], `Contact us: ${valid.subject}`, {
        name: valid.name,
        email: valid.email,
        message: valid.text
    });
    if (sent !== true && sent.error) {
        res.status(500).send(errorGenerator(500, "Failed to send email."))
    } else {
        res.send({success: true})
    }
}));


export default contact

