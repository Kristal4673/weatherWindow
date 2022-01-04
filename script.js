
//Declare a variable to store the searched city
var city = "";
// variable declaration
var citySearch = $("#citySearch");
var btnSearch = $("#btnSearch");
var btnClear = $("#btnClear");
var cityCurrent = $("#cityCurrent");
var tempCurrent = $("#tempCurrent");
var humidityCurrent = $("#humidityCurrent");
var windSpeedCurrent = $("#windSpeedCurrent");
var indexUV = $("#indexUV");
var cityPool = []; 

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
        city = cityCurrent.val().trim(); 
        weatherCurrent(city); 
    }
}
//Building the URL 
function weatherCurrent(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=c951bfd3da7610ddcabde4548ab40daf&units=imperial";
    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            // parse the response to display the current weather including the City name. the Date and the weather icon. 
            console.log(response);
            var weatherKnows = response.weather[0].icon;
            var knowsURl = "https://openweathermap.org/img/wn" + weatherKnows + "@2x.png";
            var date = new Date(response.dt * 1000).toLocaleDateString();
            $(cityCurrent).html(response.name + "(" + date + ")" + "<img scr= " + knowsURl + ">");

            var tempW = (response.main.tp);
            $(currentTemp).html(tempW.toFixed(2) + "°F");
            $(currentHumidity).html(response.main.humidity + "%");
            var WS = response.wind.speed;
            var windsMPH = (WS * 2.237).toFixed(1);
            $(windSpeedCurrent).html(windsMPH + "MPH");
            //Show UVindex
            radiationUv(response.coord.lon, response.coord.lat);
            forecast(response.id);
            if (response.cod == 200) {
                cityPool = JSON.parse(localStorage.getItem("citytitle"));
                console.log(cityPool);
                if (cityPool == null) {
                    cityPool = [];
                    cityPool.push(city.toUpperCase()
                    );
                    localStorage.setItem("citytitle", JSON.stringify(cityPool));
                    addToList(city);
                }
                else {
                    if (find(city) > 0) {
                        cityPool.push(city.toUpperCase());
                        localStorage.setItem("citytitle", JSON.stringify(cityPool));
                        addToList(city);
                    }
                }
            }
        })
}
