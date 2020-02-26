const extra = {
    "General": "Your general request will be submitted to the club secretary.",
    "Welfare concern": "Thank you reporting your concerns. They will be sent to the Wellbeing and protection officers.",
    "Website issue": "Thanks for reporting a website problem! It will be sent to the website administrator. "
};

document.addEventListener("DOMContentLoaded", function () {
    const fields = {
        name: document.getElementById("name"),
        email: document.getElementById("email"),
        subject: document.getElementById("subject"),
        text: document.getElementById("text"),
    }
    const form = document.getElementsByClassName("form")[0]
    function setSubjectHelp  () {
        const state = fields.subject.value
        if (extra[state]) {
            let help = document.getElementsByClassName("subject-help")[0]
            help.innerText = extra[state]
        }

    }
    fields.subject.addEventListener('change',setSubjectHelp)
    setSubjectHelp()


    async function onSubmit (e) {
        e.preventDefault();

        const name = fields.name.value;
        const email = fields.email.value;
        const text = fields.text.value;
        if (text && text !== "" && text.length > 5 && name && email && name !== "" && email !== "") {
            console.log({
                text,
                name,
                email,
                subject: fields.subject.value
            })
            const res = await Api.post("/contact", {
                body: {
                    text,
                    name,
                    email,
                    subject: fields.subject.value
                }
            });
            if (res.error) {
                showError(res.error.message)
            } else {
                removeChildren(form)
                const br = document.createElement("br")
                form.appendChild(br)


                const doneText = document.createElement("h1")
                doneText.className = "title has-text-centered has-text-success"
                doneText.innerText = "Request sent!"
                form.appendChild(doneText)

                const doneText2 = document.createElement("h1")
                doneText2.className = "subtitle has-text-centered"
                doneText2.innerText = "We've received your message and you should receive a response within a few days."
                form.appendChild(doneText2)
            }

        } else {
            showError("Please fill out both name, email and text.")
        }
        return false;
    }
    form.addEventListener("submit", onSubmit)


    function showError (text) {
        const errorBox = document.getElementsByClassName("error-box")[0]
        errorBox.innerText = text
        errorBox.hidden = false
    }
});

