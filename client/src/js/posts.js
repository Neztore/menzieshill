// Manages the display of posts.
// TODO: Add page dependent settings.
console.log("posts")
const Posts = {
    page: 0,
    init () {
        this.addPosts();
        console.log("init")
        this.postsContainer = document.getElementsByClassName("posts-parent")[0]
    },
    // Every new one add column
    // every 4th add new row.
    async addPosts () {
        const posts = await Api.getPosts(this.page)
        if (posts.error) {
            return createErrorMessage(posts.error.message);
        }
        // starts at 4 to force initial row
        let rowSize = 4;
        let currentRow;
        for (let counter = 0; counter < posts.length; counter++) {
            if (rowSize === 4) {
                const newRow = document.createElement("div")
                newRow.className = "columns is-desktop"
                this.postsContainer.appendChild(newRow)
                currentRow = newRow
                rowSize = 0
            }
            this.addPost(posts[counter], currentRow);
            rowSize++
        }
    },
    addPost (postInfo, parent) {
        console.log(`Add post `, parent)
      // Todo: Add facebook/image support;
        const column = document.createElement("div")
        column.className = "column is-one-quarter"
        parent.appendChild(column)

        const card = document.createElement("div")
        card.className = "card"
        column.appendChild(card)

        const content = document.createElement("div");
        content.className = "card-content"

        const title = document.createElement("p")
        title.className = "title";
        title.innerText = postInfo.title
        content.appendChild(title);

        const innerContent = document.createElement("div")
        innerContent.className = "content word-break"
        content.appendChild(innerContent)

        // Text
        const text = document.createElement("p")
        text.className = "is-size-6"
      let contentString = postInfo.content
        if (contentString > 100) {
          contentString = postInfo.content.substr(0, 100);
          contentString += "..."
        }
        text.innerText = contentString
        innerContent.appendChild(text)

        card.appendChild(content)

        const footer = document.createElement("footer")
        footer.className = "card-footer"

        const authorItem = document.createElement("p")
        authorItem.className = "card-footer-item text-special-overflow"
        authorItem.innerText = `${postInfo.author.firstName} ${postInfo.author.lastName}`
        footer.appendChild(authorItem)

        const readMore = document.createElement("p")
        readMore.className = "card-footer-item"

        const link = document.createElement("a")
        link.href = `${baseUrl}/posts/${postInfo.id}`
        link.innerText = "More"
        readMore.appendChild(link)

        footer.appendChild(readMore)
        card.appendChild(footer)

    },

    loadMore() {
        page++
        this.addPosts();
    }
};



document.addEventListener("DOMContentLoaded", function () {
    Posts.init();
})