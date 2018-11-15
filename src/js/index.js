// Service to access local storage for the application data
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
        searchBox.addEventListener('input', (e) => App.searchItem(e.target.value));
        
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
        console.log(movielist);

        const listArea = document.getElementById('movie-list');
        movielist.map(itemData => listArea.appendChild(App.createItem(itemData)));
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
        let srcval = itemData.Poster === 'N/A' ? 
            'https://dummyimage.com/150x150/f5f5f5/0919f0&text=Poster+Unavailable' : itemData.Poster;
        imgTag.setAttribute("src", srcval);
        imgTag.setAttribute("alt", itemData.Title);

        var imgDiv = document.createElement('div');
        imgDiv.className = "movie-img";
        imgDiv.appendChild(imgTag);        
        
        let itemDiv = document.createElement('div');
        itemDiv.className = "movie-item";
        itemDiv.appendChild(imgDiv);
        itemDiv.appendChild(desc);

        return itemDiv;
    },
    searchItem: (e) => {
        console.log(e);
    }
}))();

App.init();