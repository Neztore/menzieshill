// Display post for viewing.


function  displayPost (info) {
  const post = document.getElementsByClassName("post")[0]

  const title = document.createElement("h1");
  title.className = "title has-text-centered"
  title.appendChild(document.createTextNode(info.title))
  post.appendChild(title)

  post.appendChild(document.createElement("hr"))
  // Check if images
  const postInfo = document.createElement("div")
  postInfo.className = "content has-text-centered"

  postInfo.appendChild(document.createTextNode("By: "))
  const author = document.createElement("a")
  author.href = "#"
  author.appendChild(document.createTextNode(info.author.firstName + " " + info.author.lastName))
  postInfo.appendChild(author)

  postInfo.appendChild(document.createTextNode(" Created: "))
  const cDate = new Date(info.created)
  const created = document.createElement("strong")
  created.appendChild(document.createTextNode(`${cDate.getDate()}/${cDate.getMonth()}/${cDate.getFullYear()}`))
  postInfo.appendChild(created)

  postInfo.appendChild(document.createTextNode(" Updated: "))
  const uDate = new Date(info.created)
  const updated = document.createElement("strong")
  const minString = uDate.getMinutes().length > 1 ? uDate.getMinutes() : `0${uDate.getMinutes()}`
  updated.appendChild(document.createTextNode(`${uDate.getDate()}/${uDate.getMonth()}/${uDate.getFullYear()} ${uDate.getHours()}:${minString}`))
  postInfo.appendChild(updated)

  post.appendChild(postInfo)

  const contentContainer = document.createElement("div")
  const spl = info.content.split("\r\n")
  for (let line of spl) {
    const p = document.createElement("p")
    p.appendChild(document.createTextNode(line))
    contentContainer.appendChild(p)
  }
  post.appendChild(contentContainer)
}

document.addEventListener("DOMContentLoaded", async function () {
  // Get post
  const id = document.URL.split("/")[4]
  if (!isNaN(parseInt(id, 10))) {
    // It's a number
    const postInfo = await Api.get("/posts/"+id)
    if (postInfo.error) {
      createErrorMessage(`${postInfo.error.status} - ${postInfo.error.message}`)
    } else {
      displayPost(postInfo.post)
    }

  } else {
    createErrorMessage("Failed to get post: Invalid post id.")
  }
})
