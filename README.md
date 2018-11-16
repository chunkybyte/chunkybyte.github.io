<h1>Pop Tracker</h1>

A Single Page Application built in vanilla Javascript. This application uses Gulp(version 4) as the task runner.

You can :
- Search movies built using the open source OMDB API. More information on their website : http://www.omdbapi.com/
- View your personal movie collection.
- Add movies from the search result to your personal collection.
- Remove movies from your collection.
- Sort the collection based on title and release year.

<h3>Steps to get started with the project - </h3>
1. Clone the repo and install all the dependencies mentioned in package.json by hitting the command - 
      <blockquote>npm install OR npm i</blockquote>

2. You need to "build" the js and css files by running - 
      <blockquote>npm run build</blockquote>

3. Start the application by running -
      <blockquote>npm start</blockquote>
      
   Your application is up and running on port 8080. Hit http://localhost:8080/ on the browser.

The application is built <b>responsive with "Mobile-First" approach</b> with two breakpoints - 400px and 1240px. You'll get 1 movie item tile on mobile viewport (less than 400px), 2 movie tiles on tablet viewport (between 400px and 1240px) and 4 movie tiles on large viewport (exceding 1240px).

PS : Try hovering over the application logo. Very minute little animation there. Easy to miss.
