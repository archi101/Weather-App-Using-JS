// index.js

document.addEventListener('DOMContentLoaded', loadCities);

const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const addedCitiesContainer = document.getElementById('addedCitiesContainer');

// Event listener for the search button
searchButton.addEventListener('click', () => {
  const city = cityInput.value;
  cityInput.value="";
  if (city) {
    // Open a new tab with the city name as a query parameter
    window.open(`weather.html?city=${city}`, '_blank');
  } else {
    alert('Please enter a city name');
  }
});

// Function to add a city card to the home page and click and access it later
function addCityCard(city, temp, condition) {

  const existingCard = Array.from(addedCitiesContainer.children).find(card => {
    return card.querySelector('h3').innerText === city; // Check for existing city card
  });

  if (existingCard) {
    alert(`${city} already exists!`);
    return; // Prevent adding the same city card again
  }


  const cityCard = document.createElement('div');
  cityCard.classList.add('city-card');
  cityCard.innerHTML = `
        <h3>${city}</h3>
        <p>${temp}°C</p>
        <p>${condition}</p>
        <button class="remove-btn" aria-label="Remove ${city} card">&times;</button>
    `;
  addedCitiesContainer.appendChild(cityCard);
  cityCard.addEventListener('click', () => {
    if (city) {
      window.open(`weather.html?city=${city}`, '_blank');
    } else {
      alert('Please enter a city name');
    }
  });

  const removeButton = cityCard.querySelector('.remove-btn');
  removeButton.addEventListener('click', (event) => {
    event.stopPropagation(); 
    addedCitiesContainer.removeChild(cityCard);
    saveCities();
  });
  saveCities();

}

// Listen for messages from the weather page
window.addEventListener('message', (event) => {
  if (event.data && event.data.city) {
    addCityCard(event.data.city, event.data.temp, event.data.condition);
  }
});



//Local Storage

function saveCities() {
  const cities = [];
  const cityCards = document.querySelectorAll('.city-card'); // Get all city cards

  cityCards.forEach(card => {
    const cityName = card.querySelector('h3').innerText; // Get city name
    const temp = card.querySelector('p:nth-of-type(1)').innerText.replace('°C', ''); // Get temperature
    const condition = card.querySelector('p:nth-of-type(2)').innerText; // Get condition
    cities.push({ city: cityName, temp: temp, condition: condition }); // Push city details to the array
  });

  localStorage.setItem('cities', JSON.stringify(cities));
}

function loadCities() {
  const storedCities = localStorage.getItem('cities');
  if (storedCities) {
    const cities = JSON.parse(storedCities); // Parse the JSON string back to an array
    cities.forEach(cityData => {
      addCityCard(cityData.city, cityData.temp, cityData.condition); // Add city cards
    });
  }
}