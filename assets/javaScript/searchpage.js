

// function that gets called when user inputs their favortie character into the search bar
var displayCharName = document.getElementById('char-name')
var displayMovieTitles = document.getElementById('movies')
var displayShowTitles = document.getElementById('shows')
var displayCharImage = document.getElementById('char-image')
var displayStreamedMovies = document.getElementById('streamed-movies')
var displayStreamedShows = document.getElementById('streamed-shows')
var displayTitle = document.getElementById('title')
var displayPosterImage = document.getElementById('poster-image')
var displayReleaseDate = document.getElementById('release')
var displayRating = document.getElementById('rating')
var displayPlot = document.getElementById('plot')
var savedHistory = document.querySelector("#saved-history");
var storage = [];

displayLocalStorage();

// --------------------------------------  EVENT LISTENERS  ---------------------- ENTER AND CLICK  -------------------

var inputClick = document.getElementById('search-button')
inputClick.addEventListener("click", renderInput);


// --------------------------------  FORMATTING USER INPUT  ---------------------------------------

function renderInput(event) { // Function that is called on click and Enter
 var input;

 event.preventDefault();

if(event.target.innerText === "Search"){
        input = document.getElementById('search-bar').value
}
if(event.target.innerText !== "Search"){
    input = event.target.innerText
}

// ---------------------- SPLIT --------------------------
// Iterates through the inputed character name and Uppercases the First Letter and lower cases the rest + adds the required "%20" between spaces so that the API can be called properly -
    var words = input.split(" ");
   
    for (var i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }

    var charName = words.join("%20")

//--------------------  DISNEY API  -----------------------------------------------------------
var getTitles = "https://api.disneyapi.dev/character?name=" + charName;

fetch(getTitles)
.then(response => response.json())
.then(data => {

    if(data.count === 0){
        var modalClose = document.getElementById("modal-close-js")
        modalOpen.setAttribute("class", "modal is-active")
        displayTitle.textContent = "Sorry you entered an invalid character"
        modalClose.addEventListener("click", function(){
            modalOpen.setAttribute("class", "modal")}
        )
    }
    
    if (storage.includes(input) === false && data.count !== 0) {
        storage[storage.length] = input;
        localStorage.setItem("history", JSON.stringify(storage));

    }
    var movies = data['data'][0]['films'] // Retrieves the data (Films) stores it in the variable
    var shows = data['data'][0]['tvShows'] // Retrieves the data (TV Shows) stores it in the variable
    var charName = data['data'][0]['name'] // Retrieves the data (Character Name) stores it in the variable
    var image = data['data'][0]['imageUrl'] // Retrieves the data (Image of Character) stores it in the variable

    displayCharName.innerHTML = charName;  // Displays Character name on screen
    displayCharImage.setAttribute("src", image); // Displays Character Image on screen

    //Clears the text content of the list items after and before each search ---
    if(displayShowTitles.getElementsByTagName("ul")){
        displayShowTitles.textContent = ""
    }
    if(displayMovieTitles.getElementsByTagName("ul")){
        displayMovieTitles.textContent = ""
    }
    
    // Appends 2 Unordered Lists for Movies & Shows
    var showList = document.createElement("ul")
    displayShowTitles.append(showList)
    var movieList = document.createElement("ul")
    displayMovieTitles.append(movieList)

// -------------------------   SHOWS  -----------------------------   
    // Appends ALL List items (As much data that is availible) to be contained within the UL of Show Titles
    for(var i = 0; i < shows.length; i++){
        var showListItem = document.createElement("li")
        var showLink = document.createElement("a")
        showLink.textContent = shows[i]
        showList.appendChild(showListItem)
        showListItem.appendChild(showLink)
        showLink.setAttribute("id", i)
        var listenShowLink = document.getElementById(i);
        listenShowLink.addEventListener("click", renderInfo);     
    }
    
// -------------------------   MOVIES  -----------------------------
    // Appends ALL List items (As much data that is availible) to be contained within the UL of Movie Titles
    for(var j = 0; j < movies.length; j++){
        var ten = 100;
        var movieListItem = document.createElement("li")
        var movieLink = document.createElement("a")
        movieLink.textContent = movies[j]
        movieList.appendChild(movieListItem)
        movieListItem.appendChild(movieLink)
        movieLink.setAttribute("id", ten + j);
        var listenMovieLink = document.getElementById(ten + j); 
        listenMovieLink.addEventListener("click", renderInfo);
    }  
}) 
}
// --------------------------------  OMDB API  -------------------------------------

function renderInfo(event) {
    event.preventDefault();
    var userValue = event.target.innerText;

    var clickedId = event.target.id;
    var clickElement = document.getElementById(clickedId);

    clickElement.setAttribute("href", "#");
    clickElement.setAttribute("data-bs-toggle", "modal")
    clickElement.setAttribute("data-bs-target", "#modal")

    var splitUserValue = userValue.split(" ");

    for (var i = 0; i < splitUserValue.length; i++) {
        splitUserValue[i] = splitUserValue[i][0].toUpperCase() + splitUserValue[i].substr(1);
    }

    var joinUserValue = splitUserValue.join("%20");

      fetch('http://www.omdbapi.com/?t=' + joinUserValue + '&apikey=61416bd7')
        .then(response => response.json())
        .then(data => {
        
        var title = data['Title'];
        var releaseDate = data['Released'];
        var rating = data['imdbRating'];
        var plot = data['Plot'];
        var poster = data['Poster'];
        
        
        displayTitle.innerHTML = title;
        displayReleaseDate.innerHTML = "Released: " + releaseDate;
        displayRating.innerHTML = "Rating:  " + rating;
        displayPlot.innerHTML = plot;
        displayPosterImage.setAttribute("src", poster); 
   
        })
}

// Local Storage Section -------------------------

function displayLocalStorage() {
    var storedHistory = JSON.parse(localStorage.getItem("history"));
    if (storedHistory !== null) {
        storage = storedHistory;
        addHistoryDisplay()
    }
}

function addHistoryDisplay() {
    //savedHistory.innerHTML = "";
    for (var i = 0; i < 5; i++){
        var history = storage[i];

        var historyButton = document.createElement("button");
        historyButton.textContent = history;
        savedHistory.appendChild(historyButton);
        historyButton.setAttribute("class","btn");
        historyButton.addEventListener("click", renderInput) //{
            //var storageHistory = event.target.innerText;
            //console.log(storageHistory);

    }
}
       
// -------------------- ANIME.JS ------------------------------------------------
//getting the 'search-button' element by id allows you to target which button will animate
//for the user when they interact with it. when the mouse hovers aboves the button it will
//increase the width at the speed listed. 

var button = document.getElementById('search-button');

mouseHover1Animation = () => {
    anime({
        targets: button,
        width: '100%',
        scale: {
            delay: 2,
            value: 1.0
        },
        duration: 6000,
    })
}


//the next function reverses the effects of the above animation, reverting to the
// default assigned size once the mouse moves away from the button
mouseOut1Animation = () => {
    anime({
        targets: button,
        width: '50%',
        scale: {
            delay: 2,
            value: 1.0
        },
        duration: 3000,
    })
}

var buttonTop = document.getElementById('back-top')

mouseHover2Animation = () => {
    anime({
        targets: buttonTop,
        width: '100%',
        scale: {
            delay: 2,
            value: 1.5
        },
        duration: 3000,
    })
}

mouseOut2Animation = () => {
    anime({
        targets: buttonTop,
        width: '100%',
        scale: {
            delay: 2,
            value: 1.0
        },
        duration: 3000,
    })
}

button.addEventListener('mouseenter', mouseHover1Animation)
button.addEventListener('mouseleave', mouseOut1Animation)
buttonTop.addEventListener('mouseenter', mouseHover2Animation)
buttonTop.addEventListener('mouseleave', mouseOut2Animation)