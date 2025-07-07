const apiKey = process.env.Weather_API_Key; // Replace with your OpenWeatherMap API key
const apiBaseUrl = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const errorMessage = document.getElementById("error-message");
const weatherContainer = document.getElementById("weather-container");
const weatherData = document.getElementById("weather-data");
const skeleton = document.querySelector(".skeleton");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.getElementById("weather-icon");

function showSkeleton() {
    skeleton.classList.add("active");
    weatherData.classList.add("hidden");
    errorMessage.style.display = "none";
}

function hideSkeleton() {
    skeleton.classList.remove("active");
    weatherData.classList.remove("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    hideSkeleton();
}

function updateBackground(weatherMain) {
    document.body.className = ""; // Reset classes
    const weatherClass = weatherMain ? weatherMain.toLowerCase() : "";
    if (["clear", "clouds", "rain", "sunny"].includes(weatherClass)) {
        document.body.classList.add(weatherClass);
    }
}

async function fetchWeatherByCity(city) {
    showSkeleton();
    try {
        const response = await fetch(`${apiBaseUrl}?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error("City not found or API error");
        }
        const data = await response.json();
        console.log("API Response:", data); // Debug: Log response
        displayWeather(data);
    } catch (error) {
        showError(error.message || "Failed to fetch weather data");
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showSkeleton();
    try {
        const response = await fetch(`${apiBaseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error("Unable to fetch weather data");
        }
        const data = await response.json();
        console.log("API Response:", data); // Debug: Log response
        displayWeather(data);
    } catch (error) {
        showError(error.message || "Failed to fetch weather data");
    }
}

function displayWeather(data) {
    if (!data.weather || !data.weather[0] || !data.weather[0].icon) {
        console.error("Invalid weather data:", data);
        showError("Weather data incomplete");
        return;
    }
    cityName.textContent = data.name || "Unknown City";
    temperature.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
    description.textContent = `Weather: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = data.weather[0].description || "Weather icon";
    console.log("Setting icon URL:", iconUrl); // Debug: Log icon URL
    updateBackground(data.weather[0].main);
    hideSkeleton();
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => {
                showError("Geolocation access denied. Please enter a city.");
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherByCity(city);
    } else {
        showError("Please enter a city name.");
    }
});

locationBtn.addEventListener("click", getUserLocation);

cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Fetch weather for default location on page load
getUserLocation();
