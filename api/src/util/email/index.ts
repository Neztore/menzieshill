import nodemailer from "nodemailer";
import {emailToken} from '../../../config'
import {fillTemplate, templateType} from "./mailTemplates";


class Email {
    from: { name: string, address: string };
    _transporter: nodemailer.Transporter;
    constructor () {
        this.from = {
            name: 'Menzieshill web alerts',
                address: 'alerts@menzieshillwhitehall.co.uk'
        };

        const transporter = nodemailer.createTransport({
            host: "smtp.ionos.co.uk",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "alerts@menzieshillwhitehall.co.uk",
                pass: emailToken
            }
        }, {
            from: this.from
        });

        transporter.verify(function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log("E system online");
            }
        });

        this._transporter = transporter
    }
    // todo: add formating
    async sendMail (to: string, subject:string, content:string) {
        try {
            let f = await this._transporter.sendMail({
                from: this.from,
                to: to,
                subject,
                html: content
            });
            console.log(`Sent email to ${to}.`);
            return f
        } catch (e) {
            console.error("Failed to send email.");
            console.error(e.message)
        }
    }

    async send (type: templateType, to: string|Array<string>, subject: string, content:any={}):Promise<true|{error: any}> {
        content._subject = subject;
        const ready = fillTemplate(type, content);
        try {

            const resp = await this._transporter.sendMail({
                from: this.from,
                to: to,
                subject,
                html: ready
            })
            if (resp.err) {
                return {error: resp.err}
            } else {
                console.log(`Sent email to ${to}.`);
                return true;
            }
        } catch (e) {
            console.error("Failed to send email.");
            console.error(e.message)
            return { error: e }
        }
    }


}
export const EmailSystem = new Email();
export default EmailSystem

