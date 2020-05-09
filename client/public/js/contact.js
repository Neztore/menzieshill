const newStart = "New start"
// no capitals in keys
const dropDowns = {
  general: ["General query", "Website issue"],
  swimming: ["General query", newStart, "Learn to swim"],
  "water polo": ["General query",newStart],
  "welfare concern": ["Wellbeing and Protection officers", "Club president"]
}

document.addEventListener('DOMContentLoaded', function () {
  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    area: document.getElementById('area'),
    subject: document.getElementById('subject'),
    text: document.getElementById('text')
  }
  // Get initial area value and set it
  const iArea = window.location.hash ? window.location.hash.toLowerCase().substring(1) : "";
  console.log(iArea)

  for (var i = 0; i < fields.area.options.length; i++) {
    const curr = fields.area.options[i]
    if (curr.text.toLowerCase() === iArea || curr.id === iArea) {
      fields.area.selectedIndex = i;
      updateSubject();
      window.scrollTo(0, 0);
      break;
    }
  }

  const form = document.getElementsByClassName('form')[0]
  fields.area.addEventListener('change', updateSubject);

  function updateSubject () {
    const newValue = fields.area.value;
    if (newValue && dropDowns[newValue.toLowerCase()]) {
      removeChildren(fields.subject);
      for (let i =0; i<dropDowns[newValue.toLowerCase()].length; i++) {
        const curr = dropDowns[newValue.toLowerCase()][i];
        const item = document.createElement("option");
        item.innerText = curr;
        fields.subject.appendChild(item)
      }
    } else {
      alert("Something weird happened. Remove me!")
    }

  }

  async function onSubmit (e) {
    e.preventDefault()

    const name = fields.name.value
    const email = fields.email.value
    const text = fields.text.value
    if (text && text !== '' && text.length > 5 && name && email && name !== '' && email !== '') {
      console.log({
        text,
        name,
        email,
        subject: fields.subject.value
      })
      const res = await Api.post('/contact', {
        body: {
          text,
          name,
          email,
          area: fields.area.value,
          subject: fields.subject.value
        }
      })
      if (res.error) {
        showError(res.error.message)
      } else {
        removeChildren(form)
        const br = document.createElement('br')
        form.appendChild(br)

        const doneText = document.createElement('h1')
        doneText.className = 'title has-text-centered has-text-success'
        doneText.innerText = 'Request sent!'
        form.appendChild(doneText)

        const doneText2 = document.createElement('h1')
        doneText2.className = 'subtitle has-text-centered'
        doneText2.innerText = "We've received your message and you should receive a response within a few days."
        form.appendChild(doneText2)
      }
    } else {
      showError('Please fill out both name, email and text.')
    }
    return false
  }
  form.addEventListener('submit', onSubmit)

  function showError (text) {
    const errorBox = document.getElementsByClassName('error-box')[0]
    errorBox.innerText = text
    errorBox.hidden = false
  }
})
