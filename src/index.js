// 1. Get elements from your HTML
const temperature = document.querySelector(".temp");
const city = document.querySelector(".city");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");

const alertMessage = document.getElementById("alert-message");
const rainfall = document.getElementById("rainfall");
const floodRisk = document.getElementById("flood-risk");

// 2. Location: Garissa, Kenya
const latitude = 0.4536;
const longitude = 39.6401;

// 3. Open-Meteo weather API URL
const weatherURL =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=Africa%2FNairobi`;

// 4. Get weather information
function getWeather() {
    fetch(weatherURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not get weather data");
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather data:", data);

            const weather = data.current;

            // Update weather information
            temperature.textContent =
                `${weather.temperature_2m}°C`;

            city.textContent = "Garissa";

            humidity.textContent =
                `${weather.relative_humidity_2m}%`;

            wind.textContent =
                `${weather.wind_speed_10m} km/h`;

            // Update rainfall
            const rainfallAmount = weather.precipitation;
            rainfall.textContent = `${rainfallAmount} mm`;

            // Calculate a simple project flood-risk level
            if (rainfallAmount >= 20) {
                floodRisk.textContent = "HIGH";
                alertMessage.textContent =
                    "High rainfall detected. Stay alert and follow official warnings.";
            } else if (rainfallAmount >= 5) {
                floodRisk.textContent = "MEDIUM";
                alertMessage.textContent =
                    "Rainfall detected. Stay alert and monitor local conditions.";
            } else {
                floodRisk.textContent = "LOW";
                alertMessage.textContent =
                    "Low current rainfall. Continue monitoring local conditions.";
            }
        })
        .catch(error => {
            console.error("Weather error:", error);
            alertMessage.textContent =
                "Weather data unavailable. Please try again.";
        });
}

// 5. Load weather when the page opens
getWeather();

console.log("JavaScript is connected!");

// Get flood reports from JSON Server

function getFloodReports() {
    fetch("http://localhost:3000/reports")
        .then(response => response.json())
        .then(reports => {
            const reportsList = document.getElementById("reports-list");
            reportsList.innerHTML = "";

            reports.forEach(report => {
                const reportItem = document.createElement("div");
                reportItem.className = "report-item";

                reportItem.innerHTML = `
                    <h3>${report.location}</h3>
                    <p>Name: ${report.name}</p>
                    <p>Severity: ${report.severity}</p>
                    <p>${report.description}</p>
                `;

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", function () {
                    editFloodReport(report);
                });

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function () {
                    deleteFloodReport(report.id);
                });

                reportItem.appendChild(editButton);
                reportItem.appendChild(deleteButton);
                reportsList.appendChild(reportItem);
            });
        })
        .catch(error => {
            console.error("Error loading flood reports:", error);
        });
}

function editFloodReport(report) {
    const name = prompt("Enter name:", report.name);
    if (name === null) return;

    const location = prompt("Enter flood location:", report.location);
    if (location === null) return;

    const severity = prompt(
        "Enter severity: Low, Medium, or High",
        report.severity
    );
    if (severity === null) return;

    if (!["Low", "Medium", "High"].includes(severity)) {
        alert("Enter Low, Medium, or High for severity.");
        return;
    }

    const description = prompt("Enter description:", report.description);
    if (description === null) return;

    if (!name.trim() || !location.trim() || !description.trim()) {
        alert("Please fill in all fields.");
        return;
    }

    fetch(`http://localhost:3000/reports/${report.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name.trim(),
            location: location.trim(),
            severity: severity,
            description: description.trim()
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Update failed");
            }
            return response.json();
        })
        .then(() => {
            alert("Report updated successfully!");
            getFloodReports();
        })
        .catch(error => {
            console.error("Error updating report:", error);
            alert("Could not update the report.");
        });
}

function deleteFloodReport(id) {
    if (!confirm("Are you sure you want to delete this report?")) {
        return;
    }

    fetch(`http://localhost:3000/reports/${id}`, {
        method: "DELETE"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Delete failed");
            }
            alert("Report deleted successfully!");
            getFloodReports();
        })
        .catch(error => {
            console.error("Error deleting report:", error);
            alert("Could not delete the report.");
        });
}

getFloodReports();



const floodReportForm = document.getElementById("flood-report-form");

floodReportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newReport = {
        name: document.getElementById("report-name").value,
        location: document.getElementById("report-location").value,
        severity: document.getElementById("report-severity").value,
        description: document.getElementById("report-description").value
    };

    fetch("http://localhost:3000/reports", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newReport)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not save the flood report");
            }
            return response.json();
        })
        .then(() => {
            alert("Flood report submitted successfully!");

            floodReportForm.reset();

            getFloodReports();
        })
        .catch(error => {
            console.error("Error saving flood report:", error);
            alert("Could not submit the report. Please check that JSON Server is running.");
        });
});
