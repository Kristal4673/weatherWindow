//Declare a variable to store the searched city
var city = "";
// variable declaration
var btnSearch = $("#btnSearch");
var btnClear = $("#btnClear");
var citySearch = $("#citySearch");
var cityCurrent = $("#cityCurrent");
var tempCurrent = $("#tempCurrent");
var humidityCurrent = $("#humidityCurrent");
var windSpeedCurrent = $("#windSpeedCurrent");
var indexUV = $("#indexUV");
var cityPool = [];

var currentTemp = $("#tempCurrent");
var currentHumidity = $("#humidityCurrent");
var currentWS = $("#windSpeedCurrent");
var currentUV = $("#indexUV");


var forecastRow = $("#forecastRow");

//declaring forecast variables
function clearInfo() {
  citySearch.val("");
  cityCurrent.html("");
  currentTemp.html("");
  currentHumidity.html("");
  currentWS.html("");
  currentUV.html("");
  forecastRow.html("");
}

function find(c) {
  for (var i = 0; i < cityPool.length; i++) {
    if (c.toUpperCase() === cityPool[i]) {
      return -1;
    }
  }
  return 1;
}

//display the current and 5 day forecast
function showWeather(event) {
  event.preventDefault();
  if (citySearch.val().trim() !== "") {
    city = citySearch.val().trim();
    console.log(city);
    weatherCurrent(city);
  }
}
//Building the URL
function weatherCurrent(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=7647ee4e913cad6e7aaa8c05e4417e39&units=imperial";
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      // parse the response to display the current weather including the City name. the Date and the weather icon.
      console.log(response);
      var weatherKnows = response.weather[0].icon;
      var knowsURl =
        "https://openweathermap.org/img/wn" + weatherKnows + "@2x.png";
      var date = new Date(response.dt * 1000).toLocaleDateString();
      $(cityCurrent).html(
        response.name + "(" + date + ")" + "<img scr= " + knowsURl + ">"
      );

      var tempW = response.main.temp;
      $(currentTemp).html(tempW.toFixed(2) + "°F");
      $(currentHumidity).html(response.main.humidity + "%");
      var WS = response.wind.speed;
      var windsMPH = (WS * 2.237).toFixed(1);
      $(windSpeedCurrent).html(windsMPH + "MPH");
      //Show UVindex
      //   radiationUv(response.coord.lon, response.coord.lat);
      forecast(response.coord.lon, response.coord.lat);
      if (response.cod == 200) {
        cityPool = JSON.parse(localStorage.getItem("citytitle"));
        console.log(cityPool);
        if (cityPool == null) {
          cityPool = [];
          cityPool.push(city.toUpperCase());
          localStorage.setItem("citytitle", JSON.stringify(cityPool));
          addToList(city);
        } else {
          if (find(city) > 0) {
            cityPool.push(city.toUpperCase());
            localStorage.setItem("citytitle", JSON.stringify(cityPool));
            addToList(city);
          }
        }
      }
    });
}

function forecast(longitude, latitude) {
  var evening = false;
  var qForeURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    +"&lon=" +
    longitude +
    "&appid=c477bba80c4f728aff8bb672c9740ab4";
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=hourly&appid=7647ee4e913cad6e7aaa8c05e4417e39" +
    "&units=imperial";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      currentUV.html(response.current.uvi);
      displayForecast(response.daily);
    });
}

function displayForecast(forecast) {
  let rows = "";
  console.log(forecast);
  for (var i = 0; i < 5; i++) {
    rows += `
    <div class="col-sm-3">
      <p>Temperature:  <span>${forecast[i].temp.day}</span></p>
      <p>Humidity:  <span>${forecast[i].humidity}</span></p>
    </div>
  `;
  }
  forecastRow.html(rows);
}

$(document).ready(function () {
  btnSearch.click(showWeather);
  btnClear.click(clearInfo);
});

