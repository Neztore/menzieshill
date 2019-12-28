// Global
// Copyright Menzieshill Whitehall Swimming and Water Polo club 2019.

console.log("%c Site made by Josh Muir for Menzieshill Whitehall.", "font-size: 2em;color:#00a88f;font-weight:bold;")
console.log("%c Please do NOT type anything here, unless you know exactly what you are doing.", "font-size: 1.5em; color: red; font-weight: bold;")
console.log("%c The console may be used to trick you into giving other people access to your account.", "font-size: 1.25em; color: orange;")

// IE detector.
function getIEVersion() {
  var sAgent = window.navigator.userAgent;
  var Idx = sAgent.indexOf("MSIE");

  // If IE, return version number.
  if (Idx > 0)
    return parseInt(sAgent.substring(Idx+ 5, sAgent.indexOf(".", Idx)));

  // If IE 11 then look for Updated user agent string.
  else if (!!navigator.userAgent.match(/Trident\/7\./))
    return 11;

  else
    return 0; //It is not IE
}
if (getIEVersion > 0) {
  alert("We've noticed you are using Internet explorer.\nPlease note that some features on this site are not supported by your browser.\n\nIf possible, please upgrade to a newer browser.\nThanks :)")
  console.log("%c Internet explorer is not supported: Please upgrade!", "font-size: 2em; color: red")
}


function createErrorMessage (msg) {
  // TODO: Better error system - sentry
  console.error(msg);

  const notification = document.createElement("div")
  notification.className = "notification is-warning"

  const title = document.createElement("h1")
  title.className  = "is-size-5"

  title.innerText = "Oops! Something went wrong."
  notification.appendChild(title)

  const errorText = document.createTextNode(""+msg)
  notification.appendChild(errorText)

  const closeButton = document.createElement("button");
  closeButton.className = "delete"
  closeButton["aria-label"] = "close"
  notification.appendChild(closeButton)
  closeButton.addEventListener("click", function () {
    notification.remove()
  })

  document.body.prepend(notification)

}

function parseDate(time, withTime) {
  if (typeof time === 'string') {
    time = new Date(time)
  }
  function getClean (date) {
      const diff = (((new Date()).getTime() - date.getTime()) / 1000),
      day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) { console.log(`Bad date`); return}
    return day_diff == 0 && (
      diff < 60 && "just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
      day_diff == 1 && "Yesterday" ||
      day_diff < 7 && day_diff + " days ago" ||
      day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
  }
  const timeString = getClean(time)
  if (timeString) {
    return timeString
  } else {
    const day = time.getDate(),
      month = time.getMonth() + 1,
      year = time.getFullYear(),
      hour = time.getHours(),
      minutes = time.getMinutes()

    if (withTime) {
      let minuteString = minutes + ""
      if (minuteString.length === 1) {
        minuteString = `0${minuteString}`
      }
      return `${day}/${month}/${year} at ${hour}:${minuteString}`
    } else {
      return `${day}/${month}/${year}`
    }

  }
}


// Binds all close buttons
document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    $notification = $delete.parentNode;
    $delete.addEventListener('click', () => {
      $notification.parentNode.removeChild($notification);
    });
  });
});

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}
function isValidName (name) {
  return !!(name && name !== "" && name.length >= 3 && name.length <= 30);
}

class Modal {
  constructor (where) {
    this.hide = this.remove
    this.base = document.createElement("div")
    where.prepend(this.base)

    // Create modal
    this.base.className = "modal"
    const background = document.createElement("div")
    background.className = "modal-background"
    this.background = background
    this.base.appendChild(background)

    const close = document.createElement("button")
    close.className = "modal-close"
    close["aria-label"] = "close"
    this.close = close
    this.base.appendChild(close)

  }
  addContent () {
    // Should be overwritten by children
    console.error(`Modal without addContent method! `,this)
  }
  show () {
    this.base.className = this.base.className + " is-active"
    this.close.addEventListener("click", this.remove.bind(this))
    this.background.addEventListener("click", this.remove.bind(this))
    this.addContent()
  }
  remove () {
    this.base.remove()
  }
}
var GlobalModal = Modal