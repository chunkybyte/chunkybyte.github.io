// Service to interact with the local storage
const DataService = (() => ({
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
    hasProperty: (propertyName) => {
        return localStorage.hasOwnProperty(propertyName);
    }
}))();

const App = (() => ({
    // Initial Run Point of the Application
    init: () => {
        const searchBox = document.getElementById('search-box');
        searchBox.addEventListener('input', (e) => App.searchOMDBAPI(e.target.value));

        App.fetchInitialCollection();
    },
    // Fetches the initial sample data from the local JSON for the first time and stores in the local storage
    fetchInitialCollection: () => {
        if (DataService.hasProperty('data')) {
            App.populateCollection();
        } else {
            fetch('../src/data/sample.json')
                .then(res => res.json())
                .then(data => {
                    if (typeof(Storage) !== 'undefined') {
                        DataService.set('data', data.data);
                        App.populateCollection();
                    } else {
                        alert('Local Storage support not found');
                    }
                }
            );
        }
    },
    // Populates the DOM with the list of movies from the localstorage
    populateCollection: () => {
        const movielist = DataService.get('data');
        const listArea = document.getElementById('movie-list');
        listArea.innerHTML = '';
        
        if (movielist.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.className = 'all-center';
            emptyMsg.innerHTML = 'Collection Empty! Dude, Start Adding Movies!';
            listArea.appendChild(emptyMsg);
            return;
        }

        movielist.map(itemData => {
            const listItem = App.createItem(itemData);
            const delBtn = document.createElement('button');
            delBtn.className = "add-movie";
            delBtn.innerHTML = "Delete";
            delBtn.addEventListener('click', (e) => {
                App.removeFromCollection(e.target.parentElement.id);
            });
            listItem.appendChild(delBtn);

            listArea.appendChild(listItem);
        });
    },
    // Creating the HTML structure of a movie-item component
    createItem: (itemData) => {
        var title = document.createElement("span");
        title.innerHTML = itemData.Title;

        var year = document.createElement("span");
        year.innerHTML = itemData.Year;

        var breakTag = document.createElement("br");

        var desc = document.createElement('div');
        desc.className = "movie-description";
        desc.appendChild(title);
        desc.appendChild(breakTag);
        desc.appendChild(year);

        var imgTag = document.createElement('img');
        let srcval = itemData.Poster === 'N/A' ? 'https://dummyimage.com/150x150/f5f5f5/0919f0&text=Poster+Unavailable' : itemData.Poster;
        imgTag.setAttribute("src", srcval);
        imgTag.setAttribute("alt", itemData.Title);

        var imgDiv = document.createElement('div');
        imgDiv.className = "movie-img";
        imgDiv.appendChild(imgTag);        
        
        let itemDiv = document.createElement('div');
        itemDiv.className = "movie-item";
        itemDiv.id = itemData.imdbID;
        itemDiv.appendChild(imgDiv);
        itemDiv.appendChild(desc);

        return itemDiv;
    },
    searchOMDBAPI: (input) => {
        const searchSection = document.getElementById('search-result');

        if (input.length === 0) {
            searchSection.innerHTML = '';
        } 

        if (input.length >= 2) {
            fetch(`https://www.omdbapi.com/?apikey=4aaf9e6a&t=${input}&plot=short&r=json`)
                .then(res => res.json())
                .then(res => {
                    App.searchResult(res);
                }
            );
        }
    },
    searchResult: (res) => {
        const searchSection = document.getElementById('search-result');

        let resultTag;
        if (res.Response === 'False') {
            resultTag = document.createElement('p');
            resultTag.className = "no-result-message";
            resultTag.innerHTML = "Sorry, No Result Found!";
        } else {
            resultTag = App.createItem(res);

            const addBtn = document.createElement('button');
            addBtn.className = "add-movie";

            // Check if the item already exists
            if (App.checkItemExists(res.imdbID)) {
                addBtn.innerHTML = "Already Added!";
                addBtn.disabled = true;
                addBtn.className = "disable-btn";
            } else {
                addBtn.innerHTML = "Add to Collection";
                addBtn.addEventListener('click', () => {
                    App.addToCollection(res);
                });
            }

            resultTag.appendChild(addBtn);
        }

        searchSection.innerHTML = '';
        searchSection.appendChild(resultTag);
    },
    addToCollection: (itemToAdd) => {
        const movielist = DataService.get('data');
        movielist.push(itemToAdd);
        DataService.set('data', movielist);

        App.searchResult(itemToAdd);
        App.populateCollection();
    },
    removeFromCollection: (id) => {
        console.log(id);

        const movielist = DataService.get('data');
        const updatedList = movielist.filter(item => item.imdbID != id);

        DataService.set('data', updatedList);
        App.populateCollection();
    },
    checkItemExists: (id) => {
        const checkData = DataService.get('data').find(item => item.imdbID == id);
        console.log(checkData);
        if (checkData === undefined) {
            return false;
        } else {
            return true;
        }
    }
}))();

App.init();