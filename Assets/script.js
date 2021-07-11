$(document).ready(function () {
  var pastArray = [];
  var city = "";
  var APIKey = "9f72280a264ba60e8218dcb85c22c0d7";

  init();

  // Get from local storage
  function getHistory() {
    var past = JSON.parse(localStorage.getItem("past"));
    if (past) {
      pastArray = past;
      buildButton();
    }
  }

  function init() {
    getHistory();
    searchCity(pastArray[0]);
    forecast(pastArray[0]);
  }

  // Save to local storage
  function saveHistoryList() {
    localStorage.setItem("past", JSON.stringify(pastArray));
  }

  // Triggers Click Function
  $("#submit").on("click", function (event) {
    event.preventDefault();
    city = $("#search-text").val().trim();

    renderSearch(city);
    saveHistoryList(city);
    clear();
  });

  // Function for Current Forecast

  function searchCity(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var iconCode = response.weather[0].icon;
      var iconLink = "https://openweathermap.org/img/w/" + iconCode + ".png";

      $("#city-name").html("<span>" + response.name + "</span>");
      $("#date").html("<h3>" + moment().format("MMMM Do, YYYY") + "</h3>");
      $(".icon").append($("<img>").attr("src", iconLink));
      $(".current").append(
        "Temperature: " + Math.round(response.main.temp) + "•"
      );
      $(".current").append("<br/>");
      $(".current").append("Humidity: " + response.main.humidity + "%");
      $(".current").append("<br/>");
      $(".current").append("Wind Speed: " + response.wind.speed);

      // Change color based on UV Index
      var lon = response.coord.lon;
      var lat = response.coord.lat;

      var uviQueryURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey;
      $.ajax({
        url: uviQueryURL,
        method: "GET",
      }).then(function (response) {
        var uvi = response.current.uvi;
        var setUVColor = $(".uvi");
        console.log(uviQueryURL);
        if (uvi >= 0 && uvi <= 2.99) {
          setUVColor.css("color", "#90d484");
        } else if (uvi >= 3 && uvi <= 6.99) {
          setUVColor.css("background-color", "#F1EE73");
        } else if (uvi >= 7 && uvi <= 8.99) {
          setUVColor.css("background-color", "#F1AC73");
        } else {
          setUVColor.css("background-color", "#F17373");
        }
        setUVColor.append(uvi);
      });
    });
  }

  // Function for 5 Day Forecast -- adding change to trigger
  function forecast(city) {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=" +
      APIKey;

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      for (i = 0; i < 5; i++) {
        console.log(response);
        var newCard = $("<div>");
        var date = new Date();
        var deterDate =
          date.getMonth() +
          1 +
          "/" +
          (date.getDate() + i + 1) +
          "/" +
          date.getFullYear();
        var addDate = $("<h5>").text(deterDate);
        var iconCode = response.list[i].weather[0].icon;
        var iconLink = "https://openweathermap.org/img/w/" + iconCode + ".png";

      
        $(".5-day").append(newCard);
        $(".5-day").append($("<img>").attr("src", iconLink));
        $(".5-day").append(addDate);
        $(".5-day").append(
          "Temperature: " + Math.round(response.list[i].main.temp) + "•"
        );
        $(".5-day").append("<br/>");
        $(".5-day").append("Humidity: " + response.list[i].main.humidity + "%");
      }
    });
  }

  // Clears forecast
  function clear() {
    $(".current-forecast").empty();
    $(".current").empty();
    $(".uvi").empty();
    $(".icon").empty();
    $(".5-day").empty();
  }

  function renderSearch(city) {
    if (pastArray.includes(city) === false) {
      console.log(city);
      pastArray.push(city);
      saveHistoryList();
    }

    getHistory();

    searchCity(city);
    forecast(city);

    console.log(pastArray);
  }

  function buildButton() {
    $(".list").empty();
  
    for (var i = 0; i <= 6; i++) {
      if (pastArray[i]) {
        var links = $("<button>")
          .attr("class", "city btn")
          .attr("search-text", pastArray[i])
          .text(pastArray[i]);
          

        $(".list").append("</br>").append(links);
      }
    }
  }

  $(document).on("click", ".city", function (event) {
    event.preventDefault();
    var city = $(this).text();
    console.log(city);
    renderSearch(city);
    clear();
  });
});


// tab code 
function openType(event, forecastType) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(forecastType).style.display = "block";
  event.currentTarget.className += " active";
}