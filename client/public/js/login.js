Sentry.init({ dsn: 'https://f120824f080e4dc49677ad203a228004@o386921.ingest.sentry.io/1532075' });
document.addEventListener("DOMContentLoaded", function () {
  const fields = {
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    show: document.getElementById("show-pass")
  }
  const form = document.getElementsByClassName("form")[0]
  fields.show.addEventListener('change', function () {
    const state = fields.show.checked
    fields.password.type = state ? "text" : "password"
  })


  async function onSubmit (e) {
    e.preventDefault()
    const username = fields.username.value;
    const password = fields.password.value;
    if (username && password && username !== "" && password !== "") {
       const res = await Api.post("/users/login", {
         body: {
           username,
           password
         }
       });
      if (res.error) {
        showError(res.error.message)
      } else {
        window.document.location.href = "/admin"
      }
    } else {
      showError("Please fill out both username and password.")
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

