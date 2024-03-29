
function bindControl () {
  const controllers = document.querySelector(".page-control ul").children;
  if (!controllers) { return console.error("Failed to bind control for sub-page.") }

  // Set initial
  showContent(0)

  for (let i=0; i<controllers.length;i++) {
    controllers[i].addEventListener("click", function () {

      for (let c =0; c < controllers.length; c++) {
        if (c===i) {
          controllers[c].className = "is-active"
        } else {
          controllers[c].className = ""
        }
      }

      showContent(i)
    })
  }
  window.scrollTo(0, 0);
}

function showContent (pos) {
  const content = document.getElementsByClassName("page-content")[0]
  if (!content) { return console.error("Failed to bind content for sub-page.") }

  for (let i =0; i<content.children.length; i++) {
    if (i===pos) {
      content.children[i].classList.remove("is-hidden")
    } else {
      content.children[i].classList.add("is-hidden")
    }
  }
}




window.addEventListener("load", bindControl)
