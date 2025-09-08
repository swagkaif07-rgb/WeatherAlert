const apiKey = "d7b3e61502190ba27ce465005a9f531b";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const alertBox = document.getElementById("alertBox");

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (data.cod !== 200) {
            alertBox.className = "alert-box alert-danger";
            alertBox.innerHTML = "❌ City not found!";
            return;
        }

        document.getElementById("cityName").innerText = data.name + ", " + data.sys.country;
        document.getElementById("temperature").innerText = data.main.temp + "°C";
        document.getElementById("condition").innerText = data.weather[0].main;
        document.getElementById("humidity").innerText = "💧 Humidity: " + data.main.humidity + "%";
        document.getElementById("wind").innerText = "🌬 Wind: " + data.wind.speed + " m/s";
        document.getElementById("pressure").innerText = "📊 Pressure: " + data.main.pressure + " hPa";

        // Weather Alerts
        if (data.weather[0].main.toLowerCase().includes("storm") ||
            data.weather[0].main.toLowerCase().includes("rain")) {
            alertBox.className = "alert-box alert-danger";
            alertBox.innerHTML = "⚠ Heavy rain or storm expected. Stay safe!";
        } else if (data.main.temp > 35) {
            alertBox.className = "alert-box alert-danger";
            alertBox.innerHTML = "🔥 Heatwave Alert! Stay hydrated.";
        } else if (data.main.temp < 5) {
            alertBox.className = "alert-box alert-danger";
            alertBox.innerHTML = "❄ Cold wave alert! Keep warm.";
        } else {
            alertBox.className = "alert-box alert-safe";
            alertBox.innerHTML = "✅ Weather is safe. No alerts.";
        }

        getForecast(city);

    } catch (error) {
        console.error("Error fetching weather:", error);
        alertBox.className = "alert-box alert-danger";
        alertBox.innerHTML = "⚠ Error fetching weather data.";
    }
}

async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = "";

        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            const forecastCard = document.createElement("div");
            forecastCard.className = "forecast-card";
            forecastCard.innerHTML = `
                <h4>${new Date(day.dt_txt).toLocaleDateString("en-IN", { weekday: 'long' })}</h4>
                <p>🌡 ${day.main.temp_min}°C - ${day.main.temp_max}°C</p>
                <p>${day.weather[0].main}</p>
            `;
            forecastContainer.appendChild(forecastCard);
        }
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
}

// Search button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

//  Auto-detect user location on first load
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async(position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                // Reverse geocoding to get city name
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
                );
                const data = await response.json();
                if (data.name) {
                    getWeather(data.name);
                }
            } catch (error) {
                console.error("Error fetching location weather:", error);
            }
        }, (error) => {
            console.warn("Location access denied. User must search manually.");
            alertBox.className = "alert-box alert-danger";
            alertBox.innerHTML = "⚠ Please enter your city to check weather.";
        });
    }
});