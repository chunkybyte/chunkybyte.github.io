'use strict';

// Service to interact with the local storage
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
                return App.searchOMDBAPI(e.target.value);
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
            var listArea = document.getElementById('movie-list');
            listArea.innerHTML = '';

            if (movielist.length === 0) {
                var emptyMsg = document.createElement('p');
                emptyMsg.className = 'all-center';
                emptyMsg.innerHTML = 'Collection Empty! Dude, Start Adding Movies!';
                listArea.appendChild(emptyMsg);
                return;
            }

            movielist.map(function (itemData) {
                var listItem = App.createItem(itemData);
                var delBtn = document.createElement('button');
                delBtn.className = "add-movie";
                delBtn.innerHTML = "Delete";
                delBtn.addEventListener('click', function (e) {
                    App.removeFromCollection(e.target.parentElement.id);
                });
                listItem.appendChild(delBtn);

                listArea.appendChild(listItem);
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
            itemDiv.id = itemData.imdbID;
            itemDiv.appendChild(imgDiv);
            itemDiv.appendChild(desc);

            return itemDiv;
        },
        searchOMDBAPI: function searchOMDBAPI(input) {
            var searchSection = document.getElementById('search-result');

            if (input.length === 0) {
                searchSection.innerHTML = '';
            }

            if (input.length >= 2) {
                fetch('http://www.omdbapi.com/?apikey=4aaf9e6a&t=' + input + '&plot=short&r=json').then(function (res) {
                    return res.json();
                }).then(function (res) {
                    App.searchResult(res);

                    // let resultTag;
                    // if (res.Response === 'False') {
                    //     resultTag = document.createElement('p');
                    //     resultTag.className = "no-result-message";
                    //     resultTag.innerHTML = "Sorry, No Result Found!";
                    // } else {
                    //     resultTag = App.createItem(res);

                    //     const addBtn = document.createElement('button');
                    //     addBtn.className = "add-movie";

                    //     // Check if the item already exists
                    //     if (App.checkItemExists(res.imdbID)) {
                    //         addBtn.innerHTML = "Already Added!";
                    //         addBtn.disabled = true;
                    //         addBtn.className = "disable-btn";
                    //     } else {
                    //         addBtn.innerHTML = "Add to Collection";
                    //         addBtn.addEventListener('click', () => {
                    //             App.addToCollection(res);
                    //         });
                    //     }

                    //     resultTag.appendChild(addBtn);
                    // }

                    // searchSection.innerHTML = '';
                    // searchSection.appendChild(resultTag);
                });
            }
        },
        searchResult: function searchResult(res) {
            var searchSection = document.getElementById('search-result');

            var resultTag = void 0;
            if (res.Response === 'False') {
                resultTag = document.createElement('p');
                resultTag.className = "no-result-message";
                resultTag.innerHTML = "Sorry, No Result Found!";
            } else {
                resultTag = App.createItem(res);

                var addBtn = document.createElement('button');
                addBtn.className = "add-movie";

                // Check if the item already exists
                if (App.checkItemExists(res.imdbID)) {
                    addBtn.innerHTML = "Already Added!";
                    addBtn.disabled = true;
                    addBtn.className = "disable-btn";
                } else {
                    addBtn.innerHTML = "Add to Collection";
                    addBtn.addEventListener('click', function () {
                        App.addToCollection(res);
                    });
                }

                resultTag.appendChild(addBtn);
            }

            searchSection.innerHTML = '';
            searchSection.appendChild(resultTag);
        },
        addToCollection: function addToCollection(itemToAdd) {
            var movielist = DataService.get('data');
            movielist.push(itemToAdd);
            DataService.set('data', movielist);

            App.searchResult(itemToAdd);
            App.populateCollection();
        },
        removeFromCollection: function removeFromCollection(id) {
            console.log(id);

            var movielist = DataService.get('data');
            var updatedList = movielist.filter(function (item) {
                return item.imdbID != id;
            });

            DataService.set('data', updatedList);
            App.populateCollection();
        },
        checkItemExists: function checkItemExists(id) {
            var checkData = DataService.get('data').find(function (item) {
                return item.imdbID == id;
            });
            console.log(checkData);
            if (checkData === undefined) {
                return false;
            } else {
                return true;
            }
        }
    };
}();

App.init();