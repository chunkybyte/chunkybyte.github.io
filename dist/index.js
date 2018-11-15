'use strict';

// Service to access local storage for the application data
var DataService = function () {
    return {
        set: function set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function get(key) {
            return JSON.parse(localStorage.getItem(key));
        },
        hasProperty: function hasProperty(propertyName) {
            return localStorage.hasOwnProperty(propertyName);
        }
    };
}();

var App = function () {
    return {
        // Initial Run Point of the Application
        init: function init() {
            var searchBox = document.getElementById('search-box');
            searchBox.addEventListener('input', function (e) {
                return App.searchOMDB(e.target.value);
            });
            App.fetchInitialCollection();
        },
        // Fetches the initial sample data from the local JSON for the first time and stores in the local storage
        fetchInitialCollection: function fetchInitialCollection() {
            if (DataService.hasProperty('data')) {
                App.populateCollection();
            } else {
                fetch('../src/data/sample.json').then(function (res) {
                    return res.json();
                }).then(function (data) {
                    if (typeof Storage !== 'undefined') {
                        DataService.set('data', data.data);
                        App.populateCollection();
                    } else {
                        alert('Local Storage support not found');
                    }
                });
            }
        },
        // Populates the DOM with the list of movies from the localstorage
        populateCollection: function populateCollection() {
            var movielist = DataService.get('data');
            console.log(movielist);

            var listArea = document.getElementById('movie-list');
            movielist.map(function (itemData) {
                return listArea.appendChild(App.createItem(itemData));
            });
        },
        // Creating the HTML structure of a movie-item component
        createItem: function createItem(itemData) {
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
            var srcval = itemData.Poster === 'N/A' ? 'https://dummyimage.com/150x150/f5f5f5/0919f0&text=Poster+Unavailable' : itemData.Poster;
            imgTag.setAttribute("src", srcval);
            imgTag.setAttribute("alt", itemData.Title);

            var imgDiv = document.createElement('div');
            imgDiv.className = "movie-img";
            imgDiv.appendChild(imgTag);

            var itemDiv = document.createElement('div');
            itemDiv.className = "movie-item";
            itemDiv.appendChild(imgDiv);
            itemDiv.appendChild(desc);

            return itemDiv;
        },
        searchOMDB: function searchOMDB(e) {
            console.log(e);
        }
    };
}();

App.init();