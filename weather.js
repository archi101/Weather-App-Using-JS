// weather.js

// Mapping weather conditions to icon URLs
const conditionIcons = {
  "Sunny": "https://img.icons8.com/ios/500/sun.png",
  "Partly cloudy": "https://img.icons8.com/ios/500/partly-cloudy.png",
  "Cloudy": "https://img.icons8.com/ios/500/cloud.png",
  "Patchy rain nearby": "https://img.icons8.com/ios/500/rain.png",
  "Light rain": "https://img.icons8.com/ios/500/rainy.png",
  // Add more conditions as needed
};

// Get the city name from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const cityName = urlParams.get('city');
document.getElementById('cityName').textContent = cityName;

// Fetch the weather data for the specified city
fetchWeatherData(cityName);

function fetchWeatherData(city) {
  const apiKey = '097173df330e44c1b5544401242110'; // Replace with your WeatherAPI key
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;

  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Display current weather
      displayCurrentWeather(data);

      // Display humidity and precipitation
      displayHumidityAndPrecipitation(data);

      // Display hourly forecast
      displayHourlyForecast(data);

      // Display 7-day forecast
      displaySevenDayForecast(data);

      // Add event listener for adding the city to favorites
      addCityToFavorites(cityName, data);
    })
    .catch(error => console.error('Error fetching weather data:', error));
}

// Function to display current weather
function displayCurrentWeather(data) {
  const conditionText = data.current.condition.text;

  // Get the corresponding icon URL from the conditionIcons object
  const iconUrl = conditionIcons[conditionText] || data.current.condition.icon;
  
  const currentWeather = `
    <h2>${data.current.temp_c}°C, ${data.current.condition.text}</h2>
    <img src="${iconUrl}" alt="${conditionText} Icon" style="width: 50px; height: 50px;">
  `;
  document.getElementById('currentWeather').innerHTML = currentWeather;
}

// Function to display humidity and precipitation
function displayHumidityAndPrecipitation(data) {
  const humidityPrecipitation = `
    <div>Humidity: ${data.current.humidity}%</div>
    <div>Precipitation: ${data.current.precip_mm} mm</div>
  `;
  document.getElementById('humidityPrecipitation').innerHTML = humidityPrecipitation;
}

// Function to display hourly forecast
function displayHourlyForecast(data) {
  const hourlyForecast = data.forecast.forecastday[0].hour
    .filter((hour, index) => index % 2 === 0)
    .map(hour => `
      <div class="hourly-forecast-item">
        <p>${new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        <img src="${conditionIcons[hour.condition.text] || conditionIcons["Sunny"]}" alt="${hour.condition.text}" />
        <p>${hour.temp_c}°C</p>
        <p>${hour.condition.text}</p>
      </div>
    `).join('');

  document.getElementById('hourlyForecast').innerHTML = `
    <h3>Hourly Forecast</h3>
    <div class="hourly-forecast-container">${hourlyForecast}</div>
  `;
}

// Function to display 7-day forecast
function displaySevenDayForecast(data) {
  const sevenDayForecast = data.forecast.forecastday.map(day => `
    <div class="daily-forecast-item">
      <h4>${day.date}</h4>
      <p>Avg Temp: ${day.day.avgtemp_c}°C</p>
      <p>Condition: ${day.day.condition.text}</p>
      <img src="${conditionIcons[day.day.condition.text] || conditionIcons["Sunny"]}" alt="${day.day.condition.text}" />
    </div>
  `).join('');

  document.getElementById('sevenDayForecast').innerHTML = `<h3>7-Day Forecast</h3>${sevenDayForecast}`;
}

// Function to add city to favorites
function addCityToFavorites(cityName, data) {
  const addCityButton = document.getElementById('addCityButton');
  addCityButton.addEventListener('click', () => {
    window.opener.postMessage({
      city: cityName,
      temp: data.current.temp_c,
      condition: data.current.condition.text
    }, '*');
    alert(`${cityName} has been added to the home page.`);
  });
}
