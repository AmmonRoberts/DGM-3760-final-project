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

                    let faveButton = document.createElement("button");
                    faveButton.classList.add("addFavoriteButton");
                    faveButton.classList.add("addButton");
                    faveButton.innerText = "Add to Favorites";
                    faveButton.addEventListener('click', (event) => {
                        let buttonParent = event.target.parentElement.parentElement
                        let apiName = buttonParent.getAttribute("API");
                        let apiDescription = buttonParent.getAttribute("Description");

                        console.log(event.target)
                        if (!favoritesArray.find((listElement) =>
                            listElement.Link === element.Link)) {
                            console.log(element)
                            let apiObject = {
                                "API": element.API,
                                "Description": element.Description,
                                "HTTPS": element.HTTPS,
                                "Cors": element.Cors,
                                "Link": element.Link,
                                "Category": element.Category,
                                "saved": false,
                                "favoriteList": true,
                            }
                            favoritesArray.push(apiObject)
                            addToList(apiObject)

                            let d = document.createElement("div");
                            d.className = "searchResult";
                            d.setAttribute("API", apiName)
                            d.innerHTML = `
                                <h4>${apiObject.API}</h4>
                                <p>${apiObject.Description}</p>
                                <a href="${apiObject.Link}">${apiObject.Link}</a>`;
                            favorites.appendChild(d);
                        }
                    })


                    let saveListButton = document.createElement("button");
                    saveListButton.classList.add("addListButton");
                    saveListButton.classList.add("addButton");
                    saveListButton.innerText = "Save for later";
                    saveListButton.addEventListener('click', (event) => {
                        let buttonParent = event.target.parentElement.parentElement
                        let apiName = buttonParent.getAttribute("API");
                        let apiDescription = buttonParent.getAttribute("Description");

                        console.log(savedArray)
                        if (!savedArray.find((listElement
                        ) => listElement.Link === element.Link)) {

                            let apiObject = {
                                "API": element.API,
                                "Description": element.Description,
                                "HTTPS": element.HTTPS,
                                "Cors": element.Cors,
                                "Link": element.Link,
                                "Category": element.Category,
                                "saved": false,
                                "favoriteList": true,
                            }
                            savedArray.push(apiObject)
                            addToList(apiObject)

                            let d = document.createElement("div");
                            d.className = "searchResult";
                            d.setAttribute("API", apiName)
                            d.innerHTML = `
                            <h4>${apiObject.API}</h4>
                            <p>${apiObject.Description}</p>
                            <a href="${apiObject.Link}">${apiObject.Link}</a>`;
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
            }).then(
                (data) => {
                    let favorites = document.querySelector("#favorites");
                    let saved = document.querySelector("#saved");

                    // document.querySelectorAll(".addFavoriteButton").forEach((addFavoriteButton) => {
                    //     addFavoriteButton.addEventListener('click', (event) => {
                    //         let buttonParent = event.target.parentElement.parentElement
                    //         let apiName = buttonParent.getAttribute("API");
                    //         let apiDescription = buttonParent.getAttribute("Description");


                    //         if (!favoritesArray.find((element) =>
                    //             element.name === apiName)) {
                    //             console.log(element)
                    //             let apiObject = {
                    //                 "API": element.API,
                    //                 "Description": element.Description,
                    //                 "HTTPS": element.HTTPS,
                    //                 "Cors": element.Cors,
                    //                 "Link": element.Link,
                    //                 "Category": element.Category,
                    //                 "saved": false,
                    //                 "favoriteList": true,
                    //             }
                    //             favoritesArray.push(apiObject)
                    //             addToList(apiObject)

                    //             let d = document.createElement("div");
                    //             d.className = "searchResult";
                    //             d.setAttribute("API", apiName)
                    //             d.innerHTML = `
                    //                 <h4>${apiObject.CategoryAPI}</h4>
                    //                 <p>${apiObject.Description}</p>
                    //                 `;
                    //             favorites.appendChild(d);
                    //         }
                    //     })
                    // })


                    // document.querySelectorAll(".addListButton").forEach((addListButton) => {
                    //     addListButton
                    // })

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


const addToList = async (api) => {
    await fetch(`${url}${api.key}`)
        .then(async (response) => {
            if (response.ok) {
                let responseJson = await response.json()

                if (responseJson.saved === "true") {
                    api.saved = true
                }
                if (responseJson.favoriteList === "true") {
                    api.favoriteList = true
                }

                // let responseJson = response.json()
                await fetch(`${url}${api.key}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            bookName: api.title,
                            authorName: api.author,
                            bookKey: api.key,
                            saved: api.saved,
                            favoriteList: api.favoriteList,
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
                            bookName: api.title,
                            authorName: api.author,
                            bookKey: api.key,
                            saved: api.saved,
                            favoriteList: api.favoriteList,
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