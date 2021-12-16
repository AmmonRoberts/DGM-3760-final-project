let favoritesArray = [];
let savedArray = [];
let selectedCategory = "";

let url = "https://dgm-3760-final-project-backend.herokuapp.com/lists";
// let url = "http://localhost:3000/lists";

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
        fetch(`${url}/entries?title=${query}&category=${selectedCategory}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                makeButtons(data);
            })
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


const addToList = async (api) => {
    await fetch(`${url}?link=${api.Link}`)
        .then(async (response) => {
            console.log(api)
            if (response.ok) {
                let responseJson = await response.json()
                console.log(responseJson)

                if (responseJson.saved === "true") {
                    api.saved = true
                }
                if (responseJson.favoriteList === "true") {
                    api.favoriteList = true
                }

                // let responseJson = response.json()
                await fetch(`${url}/${api.Link}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            API: api.API,
                            Description: api.Description,
                            HTTPS: api.HTTPS,
                            Category: api.Category,
                            Auth: api.Auth,
                            Cors: api.Cors,
                            Link: api.Link,
                            saved: api.saved,
                            favoriteList: api.favoriteList,
                        })
                    }
                )
            }
            else {
                console.log(api)
                await fetch(`${url}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            API: api.API,
                            Description: api.Description,
                            HTTPS: api.HTTPS,
                            Category: api.Category,
                            Auth: api.Auth,
                            Cors: api.Cors,
                            Link: api.Link,
                            saved: api.saved,
                            favoriteList: api.favoriteList,
                        })
                    })
            }
        })
}


const makeButtons = (data) => {
    {
        let resultsElement = document.querySelector('#searchResults');
        resultsElement.innerHTML = "";
        if (data.entries) {
            data.entries.forEach(element => {
                let d = document.createElement("div");
                d.className = "searchResult";
                d.setAttribute("API", element.API)
                d.setAttribute("Description", element.Description)

                let faveButton = document.createElement("button");
                faveButton.classList.add("addFavoriteButton");
                faveButton.classList.add("addButton");
                faveButton.innerText = "Add to Favorites";
                faveButton.addEventListener('click', (event) => {
                    if (!favoritesArray.find((listElement) =>
                        listElement.Link === element.Link)) {
                        let apiObject = {
                            "API": element.API,
                            "Description": element.Description,
                            "HTTPS": element.HTTPS,
                            "Cors": element.Cors,
                            "Auth": element.Auth,
                            "Link": element.Link,
                            "Category": element.Category,
                            "saved": false,
                            "favoriteList": true,
                        }
                        favoritesArray.push(apiObject)
                        addToList(apiObject)

                        let d = document.createElement("div");
                        d.className = "searchResult";
                        d.setAttribute("API", element.API)
                        d.innerHTML = `
                            <h4>${apiObject.API}</h4>
                            <p>${apiObject.Description}</p>
                            <a href="${apiObject.Link}">${apiObject.Link}</a>
                        `;
                        favorites.appendChild(d);
                    }
                })


                let saveListButton = document.createElement("button");
                saveListButton.classList.add("addListButton");
                saveListButton.classList.add("addButton");
                saveListButton.innerText = "Save for later";
                saveListButton.addEventListener('click', (event) => {

                    if (!savedArray.find((listElement
                    ) => listElement.Link === element.Link)) {

                        let apiObject = {
                            "API": element.API,
                            "Description": element.Description,
                            "HTTPS": element.HTTPS,
                            "Cors": element.Cors,
                            "Auth": element.Auth,
                            "Link": element.Link,
                            "Category": element.Category,
                            "saved": false,
                            "favoriteList": true,
                        }
                        savedArray.push(apiObject)
                        addToList(apiObject)

                        let d = document.createElement("div");
                        d.className = "searchResult";
                        d.setAttribute("API", element.API)
                        d.innerHTML = `
                            <h4>${apiObject.API}</h4>
                            <p>${apiObject.Description}</p>
                            <a href="${apiObject.Link}">${apiObject.Link}</a>
                        `;
                        saved.appendChild(d);
                    }
                })


                let buttonGroup = document.createElement("div");
                buttonGroup.className = "buttonGroup";
                buttonGroup.appendChild(faveButton);
                buttonGroup.appendChild(saveListButton);

                d.innerHTML =
                    `<h4>${element.API}</h4>
                 <p>${element.Description}</p>
                 <a href="${element.Link}">${element.Link}</a>
                 `

                d.appendChild(buttonGroup)

                resultsElement.appendChild(d)
            });
        }
        else {
            resultsElement.innerHTML = "<p>Couldn't find anything with that request!</p>";
        }
    }
}

const getAllCategories = async () => {
    await fetch(`${url}/categories`)
        .then(async (data) => {
            let categorySelect = document.querySelector("#categorySelect")

            let responseCategories = await data.json()

            responseCategories.forEach((element) => {
                var option = document.createElement("option");
                option.value = element;
                option.text = element;
                categorySelect.appendChild(option);
            })
        });
}

const getRandom = async () => {
    await fetch(`${url}/random?category=${selectedCategory}`)
        .then(async (data) => {
            makeButtons(await data.json())
        });
}
document.querySelector("#getRandom").addEventListener("click", getRandom)


const getAllLists = async () => {
    // Still needs to be updated
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

let categorySelectElement = document.querySelector("#categorySelect")

categorySelectElement.addEventListener("change", (event) => {
    selectedCategory = event.target.value
})

getAllCategories()
getAllLists()