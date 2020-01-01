const nodemailer = require("nodemailer")
class Email {
  constructor () {
    this.from = "alerts@menzieshillwhitehall.co.uk"
    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.co.uk",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "alerts@menzieshillwhitehall.co.uk",
        pass: "XKVebPdKg^!sW8*$u*Ad"
      }
    }, {
      from: this.from
    });

    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    this._transporter = transporter
  }
  // todo: add formating
  async sendMail (to, subject, content) {
    const info = await this._transporter.sendMail({
      from: this.from,
      to: to,
      subject,
      html: content
    });
  }
}
const email = new Email()
async function a () {
 const f =email.sendMail("josh.muir45@gmail.com", "Testing email system", "<h2>A test email intended to test whether nodemail works, or not. </h2>")
 console.log(f)
}
a()

