document.addEventListener("DOMContentLoaded", function () {
  const fields = {
    firstName: document.getElementById("first-name"),
    lastName: document.getElementById("last-name"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    password2: document.getElementById("password2"),
    username: document.getElementById("username"),
    terms: document.getElementById("terms-agreement"),
    submit: document.getElementById("submit")
  }
  fields.terms.checked = false
  fields.submit.disabled = true
  // Used for derived fields, like password2 or username.
  const values = {
    firstName:removeWhitespace(fields.firstName.value),
    lastName:removeWhitespace(fields.lastName.value),
    password:fields.password.value
  }

  const form = document.getElementsByClassName("form")[0]
  form.addEventListener("submit", async function (e) {
    e.preventDefault()
    const errors = document.getElementsByClassName("error-box")
    if (errors.length === 0) {
      const sendValues = {
        firstName: removeWhitespace(fields.firstName.value),
        lastName: removeWhitespace(fields.lastName.value),
        password: fields.password.value,
        username: removeWhitespace(fields.username.value),
        email: removeWhitespace(fields.email.value)
      }
      if (sendValues.firstName && sendValues.lastName && sendValues.email && sendValues.password && sendValues.username) {
        // It's OK: Send.
        hideError(fields.submit, true)
        const res = await Api.post(`/users/register`, {
          body: sendValues
        })
        if (res.error) {
          if (res.error.errors) {
            for (let err of res.error.errors) {
              console.log("in")
              const ele = fields[err.field]
              if (!ele) {
                createErrorMessage(err.msg)
              } else {
                showErrorText(ele, err.msg)
              }
            }
            window.scrollTo(0, 0)
          } else {
            createErrorMessage(res.error.message)
          }
        } else {
          window.location.href = "/";
        }
      } else {
        showErrorText(fields.submit, "Not all fields have been completed. Please fill them all out and try again.", true)
      }

    } else {
      console.log("aa")
      showErrorText(fields.submit, "Some fields have errors that must be fixed first.", true)
    }
  })



  fields.firstName.addEventListener("change", function () {
    const value = removeWhitespace(fields.firstName.value)
   if (!value ||value.length > 30) {
     showErrorText(fields.firstName, `Must be present and less than 30 characters.`)
   } else {
     hideError(fields.firstName)
     fields.firstName.value = value
     values.firstName = value

     if (values.firstName && values.lastName) {
       assignUsername(values.firstName, values.lastName)
     }
   }
  })
  fields.lastName.addEventListener("change", function () {
    const value = removeWhitespace(fields.lastName.value)
    if (!value ||value.length > 30) {
      showErrorText(fields.lastName, `Must be present and less than 30 characters.`)
    } else {
      hideError(fields.lastName)
      fields.lastName.value = value
      values.lastName = value

      if (values.firstName && values.lastName) {
        assignUsername(values.firstName, values.lastName)
      }
    }
  })

  fields.email.addEventListener("change", function () {
    const value = removeWhitespace(fields.email.value)
    if (!value.length || value.length > 50) {
      showErrorText(fields.email, `Must be present and less than 30 characters.`)
    } else {
      if (fields.email.reportValidity())  {
        hideError(fields.email)
        values.email = value
      } else {
        showErrorText(fields.email, `Invalid email address`)
      }
    }
  })

  fields.password.addEventListener("change", function () {
    const value = fields.password.value
    if (value.length < 6) {
      showErrorText(fields.password, `Must be more than 6 characters.`)
    } else {
      hideError(fields.password)
      values.password = value
      if (value === values._password2) {
        hideError(fields.password2)
      }
    }
  })

  fields.password2.addEventListener("change", function () {
    const value = fields.password2.value
    if (value !== values.password || value === "") {
      showErrorText(fields.password2, `Passwords must match.`)
      values._password2 = value
    } else {
      hideError(fields.password2)
      values._password2 = value
      // not added to values because we don't send it to server
    }
  })

  fields.username.addEventListener("change", function () {
    const value = removeWhitespace(fields.username.value)

    if (!value || value.length > 50) {
      showErrorText(fields.username, `Must be present and less than 30 characters.`)
    } else {
      hideError(fields.username)
      values.username = value
    }
  })

  fields.terms.addEventListener("change", function () {
    const value = fields.terms.checked
    fields.submit.disabled = !value
    if (value) {
      hideError(fields.terms)
    } else {
      showErrorText(fields.terms, "Oops! You need to accept our terms to continue.")
      // not added to values because we don't send it to server
    }
  })

  function showErrorText (ele, errorText, submit) {
    const classText = submit ? "error-box-submit" : "error-box"
    const box = ele.parentElement.getElementsByClassName(classText)
    if (box.length !== 0)return false

    const errorBox = document.createElement("p")
    errorBox.className = `is-danger ${classText} help`
    errorBox.innerText = errorText
    ele.parentElement.appendChild(errorBox)
    if (!submit) ele.classList.add("is-danger")

    ele.classList.remove("is-success")
  }

  function hideError (ele, submit) {
    const classText = submit ? "error-box-submit" : "error-box"
    const box = ele.parentElement.getElementsByClassName(classText)
    if (box[0])
      box[0].remove()
    ele.classList.remove("is-danger")
    if (!submit) ele.classList.add("is-success")
  }


  async function assignUsername (firstName, lastName) {
    fields.username.value = firstName + lastName
   // this was originally for name availability check, but (a) that could be abused and (b) I can't really be bothered.
  }

})



function  removeWhitespace (str) {
  str.replace(/ /g,'')
  if (str === "") return undefined
  return str
}