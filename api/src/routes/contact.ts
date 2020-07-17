import express, {Request, Response} from "express";

import {isEmail, normalizeEmail, escape} from 'validator';

import {
    cleanString,
    errorCatch,
    errorGenerator, validName,
    validString,

} from '../util'

import EmailSystem from "../util/email";

const contact = express.Router();

type Subjects = typeof emailSubjects;
const emailSubjects = {
  default: "secretary@menzieshillwhitehall.co.uk",
  testing: "admin@menzieshillwhitehall.co.uk",
  general: {
    "general query": "secretary@menzieshillwhitehall.co.uk",
    "website issue": "admin@menzieshillwhitehall.co.uk"
  },
  swimming: {
    "general query": "swimming@menzieshillwhitehall.co.uk",
    "new start": "swimming@menzieshillwhitehall.co.uk",
    "learn to swim": "swimming@menzieshillwhitehall.co.uk"
  },
  "water polo": {
    "general query": "waterpolo@menzieshillwhitehall.co.uk",
    "new start": "waterpolo@menzieshillwhitehall.co.uk",
  },
  "welfare concern": {
    "wellbeing and protection officers": "wpo@menzieshillwhitehall.co.uk",
    "club president":"president@menzieshillwhitehall.co.uk"
  }
};
function getEmailAddress (area: keyof Subjects, subject: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`Email: Not production!`);
    return emailSubjects.testing
  }
  if (emailSubjects[area]) {
    // @ts-ignore
    if (emailSubjects[area][subject]) {
      // @ts-ignore
      return emailSubjects[area][subject]
    } else {
      return emailSubjects.default;
    }
  } else {
    // Not found
    console.log(`Did not find area ${area}.`);
    return emailSubjects.default
  }
}

// UserEntity ID should be either a valid userId string or @me
contact.post('/', errorCatch(async (req: Request, res:Response) => {
   const {
       name,
       email,
       text,
       subject,
     area
   } = req.body;

    const valid:any = {};
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
    if (validString(subject) && validString(area)) {
      // 50 should never be an issue
      valid.subject = escape(subject).substring(0, 50);
      valid.area = escape(area).substring(0, 50);


    } else {
            return res.status(400).send(errorGenerator(400, "Area and subject are required and must be valid."))
        }

    // We got here, so it's valid.
    const to = getEmailAddress(area, subject);

    const sent = await EmailSystem.send('contactUs',[to, valid.email], `Contact us: ${valid.area} - ${valid.subject}`, {
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

