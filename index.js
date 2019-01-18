document.addEventListener("DOMContentLoaded", function() {

  /*****************************************************************************
    * Variables and other Data
  *****************************************************************************/

  const listOfBooks = document.querySelector('#list')
  const showPanel = document.querySelector('#show-panel')
  let allBooks = []
  user1 = {"id":1, "username":"pouros"}

  /*****************************************************************************
    * Fetch onload
  *****************************************************************************/

  fetch('http://localhost:3000/books')
  .then(r => r.json())
  .then(booksJSONData => {
    allBooks = booksJSONData
    listOfBooks.innerHTML = renderAllBooks(allBooks)
  })

  /*****************************************************************************
    * Event Listeners
  *****************************************************************************/



  listOfBooks.addEventListener('click', (e) => {
    if (e.target.tagName === "LI") {
      foundBook = allBooks.find(function(book) {
        return e.target.id == book.id
      })
      showPanel.innerHTML = bookShowHTML(foundBook)
    }
  })

  showPanel.addEventListener('click', (e) => {
    usersWhoLiked = document.querySelector('.users-who-liked')
    if (e.target.tagName === "BUTTON") {
      // console.log(e.target.dataset.likesId)
      // usersWhoLiked.innerHTML +=  `<h3 data-id="${user1.id}">${user1.username}</h3>`
      foundBook = allBooks.find(function(book) {
        return e.target.dataset.likesId == book.id
      })
      foundBookUsers = foundBook.users.map(function(attribute) {
        return attribute
      })
      foundBookUsers.push(user1)
      console.log(foundBookUsers)
      fetch(`http://localhost:3000/books/${e.target.dataset.likesId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Action: "application/json"
        },
        body: JSON.stringify({
          likes: foundBookUsers
        })
      })
      .then(r => r.json())
      .then((updatedBook) => {
        const oldLikes = allBooks.find(function(book) {
          return book.id === updatedBook.id
        })
        const oldLikesIndex = allBooks.indexOf(oldLikes)
        allBooks[oldLikesIndex] = updatedBook
        console.log(updatedBook);
        showPanel.innerHTML = bookShowHTML(foundBook)
      })
    }
  })

});

/******************************************************************************
  * Helper Functions (PURE!)
******************************************************************************/

const renderAllBooks = (allBooks) => {
  return allBooks.map((book) => bookInfoHTML(book)).join('')
}

const bookInfoHTML = (book) => {
  return `
    <li id="${book.id}">${book.title}</li>
  `
}

const bookShowHTML = (function(foundBook) {
  likedUsers = foundBook.users.map(function(attribute) {
    return `<div class="users-who-liked" data-id="${foundBook.id}">
    <h3 data-id="${attribute.id}">${attribute.username}</h3>
    </div>`
  })
  return `
<div id="${foundBook.id}">
  <img src="${foundBook.img_url}">
  <p>${foundBook.description}</p>
  ${likedUsers.join('')}
  <button data-likes-id="${foundBook.id}" type="button">Read Book</button>
</div>
`
})

/******************************************************************************
  * Helper Functions (IMPURE!)
******************************************************************************/


//     fetch(`http://localhost:3000/toys/${e.target.parentElement.dataset.id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         "Accept": "application/json"
//       },
//       body: JSON.stringify({
//         "likes": (allToys.find(toy => toy.id == e.target.parentElement.dataset.id).likes) + 1
//       })
//     })
//     .then(response => response.json())
//     .then((jsonToy) => {
//       toyIndex = allToys.findIndex(toy => toy.id == jsonToy.id)
//       allToys[toyIndex].likes += 1
//       toyContainer.innerHTML = renderAllToys(allToys)
//     })
//   }
// })
