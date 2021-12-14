let favoritesArray = [];
let savedArray = [];

let url = "http://localhost:3000/lists";

let accordion = document.querySelectorAll(".accordion");

for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener("click", (event) => {
        let button = event.target
        button.classList.toggle("active");
        let panel = button.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

const search = async () => {
    let query = document.querySelector('#searchText').value;
    if (query != '') {
        fetch(`${url}/entries?title=${query}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let resultsElement = document.querySelector('#searchResults');
                resultsElement.innerHTML = "";
                data.entries.forEach(element => {
                    console.log(element)
                    let d = document.createElement("div");
                    d.className = "searchResult";
                    d.setAttribute("API", element.API)
                    d.setAttribute("Description", element.Description)
                    // d.setAttribute("bookAuthor", element.author_name)
                    d.innerHTML =
                        `<h4>${element.API}</h4>
                        <p>${element.Description}</p>
                      <div class="buttonGroup">
                      <button class="addFavoriteButton addButton">Add to Favorites</button>
                      <button class="addListButton addButton">Save for later</button>
                      </div>
                        </div>
                `
                    resultsElement.appendChild(d)
                });
            }).then(
                (data) => {
                    let favorites = document.querySelector("#favorites");
                    let saved = document.querySelector("#saved");

                    document.querySelectorAll(".addFavoriteButton").forEach((element) => {
                        element.addEventListener('click', (event) => {
                            let element = event.target.parentElement.parentElement
                            let bookKey = element.getAttribute("bookKey");
                            let bookTitle = element.getAttribute("bookTitle");
                            let bookAuthor = element.getAttribute("bookAuthor");


                            if (!favoritesArray.find(({
                                key
                            }) => key === bookKey)) {

                                let bookObject = {
                                    "key": bookKey,
                                    "title": bookTitle,
                                    "author": bookAuthor,
                                    "saved": false,
                                    "favoriteList": true,
                                }
                                favoritesArray.push(bookObject)
                                addToList(bookObject)

                                let d = document.createElement("div");
                                d.className = "searchResult";
                                d.setAttribute("key", bookKey)
                                d.innerHTML = `
                                    <h4>${bookTitle}</h4>
                                    <p>${bookAuthor}</p>
                                    `;
                                favorites.appendChild(d);
                            }
                        })
                    })


                    document.querySelectorAll(".addListButton").forEach((element) => {
                        element.addEventListener('click', (event) => {
                            let element = event.target.parentElement.parentElement
                            let bookKey = element.getAttribute("bookKey");
                            let bookTitle = element.getAttribute("bookTitle");
                            let bookAuthor = element.getAttribute("bookAuthor");

                            if (!savedArray.find(({
                                key
                            }) => key === bookKey)) {

                                let bookObject = {
                                    "key": bookKey,
                                    "title": bookTitle,
                                    "author": bookAuthor,
                                    "saved": true,
                                    "favoriteList": false,
                                }
                                favoritesArray.push(bookObject)
                                addToList(bookObject)

                                let d = document.createElement("div");
                                d.className = "searchResult";
                                d.setAttribute("key", bookKey)
                                d.innerHTML = `
                                        <h4>${bookTitle}</h4>
                                        <p>${bookAuthor}</p>
                                        
                                        `;
                                saved.appendChild(d);
                            }
                        })
                    })

                }
            )
            .catch((err) => {
                console.log('Something went wrong!', err);
                alert('Please double check your search query!');
            });
    }
}


document.querySelector(`#search`).addEventListener('click', (event) => {
    event.preventDefault();
    search();
})
document.querySelector(`#searchText`).addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        search();
    }
})


const addToList = async (book) => {
    await fetch(`${url}${book.key}`)
        .then(async (response) => {
            if (response.ok) {
                let responseJson = await response.json()

                if (responseJson.saved === "true") {
                    book.saved = true
                }
                if (responseJson.favoriteList === "true") {
                    book.favoriteList = true
                }

                // let responseJson = response.json()
                await fetch(`${url}${book.key}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            bookName: book.title,
                            authorName: book.author,
                            bookKey: book.key,
                            saved: book.saved,
                            favoriteList: book.favoriteList,
                        })
                    }



                )
            }
            else {
                await fetch(`${url}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            bookName: book.title,
                            authorName: book.author,
                            bookKey: book.key,
                            saved: book.saved,
                            favoriteList: book.favoriteList,
                        })
                    })
            }
        })
}

const getAllLists = async () => {
    savedArray = []
    favoritesArray = []

    let favorites = document.querySelector("#favorites");
    let saved = document.querySelector("#saved");

    await fetch(`${url}`)
        .then(async (response) => {
            let responseJson = await response.json()

            responseJson.forEach((element) => {
                if (element.saved === "true") {

                    savedArray.push({
                        "key": element.bookKey,
                        "title": element.bookName,
                        "author": element.authorName,
                        "saved": element.saved,
                        "favoriteList": element.favoriteList,
                    })

                    let d = document.createElement("div");
                    d.className = "searchResult";
                    d.setAttribute("key", element.bookKey)
                    d.innerHTML = `
                            <h4>${element.bookName}</h4>
                            <p>${element.authorName}</p>
                            
                            `;
                    saved.appendChild(d);
                }
                if (element.favoriteList === "true") {

                    favoritesArray.push({
                        "key": element.bookKey,
                        "title": element.bookName,
                        "author": element.authorName,
                        "saved": element.saved,
                        "favoriteList": element.favoriteList,
                    })

                    let d = document.createElement("div");
                    d.className = "searchResult";
                    d.setAttribute("key", element.bookKey)
                    d.innerHTML = `
                            <h4>${element.bookName}</h4>
                            <p>${element.authorName}</p>
                            
                            `;
                    favorites.appendChild(d);
                }


            })

        })
}
getAllLists()