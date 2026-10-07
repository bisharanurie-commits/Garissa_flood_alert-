
const weatherButton = document.getElementById("check-weather");

const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const rainfall = document.getElementById("rainfall");
const windSpeed = document.getElementById("wind-speed");
const weatherDescription = document.getElementById("weather-description");

const latitude = 0.4536;
const longitude = 39.6401;

function getWeather() {

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=Africa%2FNairobi`;

  fetch(url)
    .then(response => response.json())
    .then(data => {

      const currentWeather = data.current;

      temperature.textContent = currentWeather.temperature_2m + " °C";

      humidity.textContent = currentWeather.relative_humidity_2m + " %";

      rainfall.textContent = currentWeather.precipitation + " mm";

      windSpeed.textContent = currentWeather.wind_speed_10m + " km/h";

      weatherDescription.textContent =
        getWeatherDescription(currentWeather.weather_code);

    })
    .catch(error => {
      console.log("Error getting weather:", error);
      weatherDescription.textContent = "Weather data unavailable";
    });
}

function getWeatherDescription(code) {

  if (code === 0) {
    return "Clear sky";
  }

  if (code === 1 || code === 2 || code === 3) {
    return "Partly cloudy";
  }

  if (code === 45 || code === 48) {
    return "Fog";
  }

  if (code >= 51 && code <= 57) {
    return "Drizzle";
  }

  if (code >= 61 && code <= 67) {
    return "Rain";
  }

  if (code >= 80 && code <= 82) {
    return "Rain showers";
  }

  if (code >= 95) {
    return "Thunderstorm";
  }

  return "Unknown weather";
}

weatherButton.addEventListener("click", getWeather);
console.log("JavaScript is connected!");


const reportsURL = "http://localhost:3000/reports";

fetch(reportsURL)
  .then(response => response.json())
  .then(data => {
    console.log("Flood reports:", data);
    displayReports(data);
  })
  .catch(error => {
    console.error("Error:", error);
  });


// Display flood reports on the webpage
function displayReports(reports) {

  const reportsList = document.getElementById("reports-list");

  reportsList.innerHTML = "";

  reports.forEach(report => {

    const reportCard = document.createElement("div");

    reportCard.innerHTML = `
      <h3>${report.location}</h3>
      <p><strong>Name:</strong> ${report.name}</p>
      <p><strong>Severity:</strong> ${report.severity}</p>
      <p><strong>Description:</strong> ${report.description}</p>
    `;

    reportsList.appendChild(reportCard);
  });
}
function checkFloodRisk(weather) {

  const rainfallAmount = weather.precipitation;

  const alertMessage = document.getElementById("alert-message");

  if (rainfallAmount >= 20) {

    alertMessage.textContent =
      "HIGH FLOOD RISK! Heavy rainfall detected. Stay alert and move to a safe place.";

  } else if (rainfallAmount >= 5) {

    alertMessage.textContent =
      "MEDIUM FLOOD RISK. Rainfall detected. Please stay alert.";

  } else {

    alertMessage.textContent =
      "LOW FLOOD RISK. No significant rainfall detected.";
  }
}
