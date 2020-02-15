import nodemailer from "nodemailer";
import {emailToken} from '../../config'

class Email {
    from: string;
    _transporter: nodemailer.Transporter;
    constructor () {
        this.from = "alerts@menzieshillwhitehall.co.uk";
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
                console.log("Email system online");
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


}
export const EmailSystem = new Email();
export default EmailSystem

