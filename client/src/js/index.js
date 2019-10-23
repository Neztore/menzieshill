// Global
// Copyright Menzieshill Whitehall Swimming and Water Polo club 2019.
console.log("%c Menzieshill Whitehall Swimming & WP site.", "font-size: 2em;")
console.log("%c Please do NOT type anything here, unless you know exactly what you are doing.", "font-size: 1.5em; color: red; font-weight: bold;")
console.log("%c The console is often used to trick people into giving other people access to their account.", "font-size: 1.25em; color: orange;")
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
  // TODO: Better error system
  console.error(msg)
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