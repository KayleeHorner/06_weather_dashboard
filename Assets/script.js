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

      $("#city-name").html("<h1>" + response.name + "</h1>");
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
          setUVColor.css("background-color", "green");
        } else if (uvi >= 3 && uvi <= 6.99) {
          setUVColor.css("background-color", "yellow");
        } else if (uvi >= 7 && uvi <= 8.99) {
          setUVColor.css("background-color", "orange");
        } else {
          setUVColor.css("background-color", "red");
        }
        setUVColor.append("UV Index: " + uvi);
      });
    });
  }

  // Function for 5 Day Forecast
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
        var newCard = $("<div>").attr("class", "col-md-8 p-2");
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

        $(".5-day").append("<hr/>");
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

        $(".list").append(links);
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
