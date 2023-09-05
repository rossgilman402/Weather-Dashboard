// DOM ELEMENTS
var locationButtonsEl = document.querySelector("#location-buttons");
var searchButtonEl = document.querySelector("#submit");

// DATA
var searchHistory;
if (localStorage.getItem("search-history-buttons") === null) {
  searchHistory = [];
} else {
  searchHistory =
    localStorage.getItem("search-history-buttons").split(",") || [];
}

// FUNCTIONS

// User Interactions

// Init

//Set up default location which is Atlanta
// Check for which button is clicked
var buttonClickHandler = function (event) {
  var location = event.target.getAttribute("data-location");
  if (location) {
    getWeatherData(location);
  }
};

// //Get the data for each location depending on which button is clicked
var getWeatherData = function (location) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    location +
    "&appid=fc752979c9a03d081124d79f97e7f0d7&units=imperial";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        populatePage(data);
        //We are going to have to create build and place not only the right side 5-day forecast but also the search history buttons on the left side

        //Write a loop to go through each day
        //This will be in a function (updateWeather)
        //Create variables for each data entry
        // - we want to use every 8 index to get the next day
        // data.list[i] -> .dt_txt = date, .main.temp = temperature, .wind.speed = wind speeds, .main.humidity = humidity
        // - for picture of current weather do we use .weather.icon or .weather.description
        //We want to index each card type and place the data
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

// //Function to populate the cards on the page
function populatePage(data) {
  console.log(data.list[0].weather[0].icon);
  //Populate the top card
  var top = document.querySelector("#top");
  var topHeader = document.querySelector("#top-header");
  var topIcon = document.querySelector("#icon");
  var topTemp = document.querySelector("#top-temp");
  var topWind = document.querySelector("#top-wind");
  var topHumidity = document.querySelector("#top-humidity");

  topHeader.textContent =
    data.city.name + " " + data.list[0].dt_txt.split(" ")[0];
  topIcon.setAttribute(
    "src",
    "http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png"
  );
  topTemp.textContent = "Temp: " + data.list[0].main.temp + " F";
  topWind.textContent = "Wind: " + data.list[0].wind.speed + " MPH";
  topHumidity.textContent = "Humidity: " + data.list[0].main.humidity + " %";

  top.appendChild(topHeader);
  top.appendChild(topIcon);
  top.appendChild(topTemp);
  top.appendChild(topWind);
  top.appendChild(topHumidity);

  var day = 8;

  for (var i = 1; i <= 5; i++) {
    var currentCard = document.querySelector(`#card${i}`);
    var currentCardHeader = document.querySelector(`#card${i}Header`);
    var currentCardIcon = document.querySelector(`#icon${i}`);
    var currentCardTemp = document.querySelector(`#card${i}Temp`);
    var currentCardWind = document.querySelector(`#card${i}Wind`);
    var currentCardHumidity = document.querySelector(`#card${i}Humidity`);

    currentCardHeader.textContent =
      data.city.name + " " + data.list[day].dt_txt.split(" ")[0];
    currentCardIcon.setAttribute(
      "src",
      "http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png"
    );
    currentCardTemp.textContent = "Temp: " + data.list[day].main.temp + " F";
    currentCardWind.textContent = "Wind: " + data.list[day].wind.speed + " MPH";
    currentCardHumidity.textContent =
      "Humidity: " + data.list[day].main.humidity + " %";

    currentCard.appendChild(currentCardHeader);
    currentCard.appendChild(currentCardIcon);
    currentCard.appendChild(currentCardTemp);
    currentCard.appendChild(currentCardWind);
    currentCard.appendChild(currentCardHumidity);
    if (i === 4) {
      day += 7;
    } else {
      day += 8;
    }
  }
}

//Function to get the buttons on the left side
function getButtons() {
  var locationButtonsEl = document.querySelector("#location-buttons");

  if (searchHistory.length === 0) {
    return;
  }

  for (var i = 0; i < searchHistory.length; i++) {
    var currentButton = document.createElement("button");
    currentButton.setAttribute("data-location", searchHistory[i]);
    currentButton.setAttribute("class", "btn btn-primary");
    currentButton.textContent = searchHistory[i];

    locationButtonsEl.appendChild(currentButton);
  }
}

//Function to create a button
function createButton(city_name) {
  var locationButtonsEl = document.querySelector("#location-buttons");
  var currentButton = document.createElement("button");
  currentButton.setAttribute("data-location", city_name);
  currentButton.setAttribute("class", "btn btn-primary");
  currentButton.textContent = city_name;

  locationButtonsEl.appendChild(currentButton);
  searchHistory.push(city_name);
  localStorage.setItem("search-history-buttons", searchHistory);
}

// //Need to create a function that will start the program showing Atlanta as the first card (alphabetical order)
function startScreen() {
  getWeatherData("Atlanta");
  getButtons();
}
// //Need to create a function that will work the same as the buttons on the left side except that it will take a different city that the buttons don't currenty show
function getCity() {
  var cityInput = document.querySelector("#city");
  getWeatherData(cityInput.value);
  createButton(cityInput.value);
}

//Need to create a function that will hold all of the buttons and data for those buttons on the left side (search history) setLocalStorage

startScreen();

locationButtonsEl.addEventListener("click", buttonClickHandler);

searchButtonEl.addEventListener("click", getCity);
