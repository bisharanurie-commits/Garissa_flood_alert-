// Get elements from your HTML
const temperature = document.querySelector(".temp");
const city = document.querySelector(".city");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");

const alertMessage = document.getElementById("alert-message");
const rainfall = document.getElementById("rainfall");
const floodRisk = document.getElementById("flood-risk");

// Location: Garissa, Kenya
const latitude = 0.4536;
const longitude = 39.6401;

// Open-Meteo weather API URL
const weatherURL =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=Africa%2FNairobi`;