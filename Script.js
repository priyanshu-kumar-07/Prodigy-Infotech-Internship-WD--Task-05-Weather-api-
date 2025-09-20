const apiKey = "255ef69791cd78cd44397f65dfba8817";

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city name.");
  fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
}

function getWeatherByLocation() {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      fetchWeather(url);
    },
    error => {
      alert("Unable to retrieve your location.");
    }
  );
}

function fetchWeather(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        alert("City not found.");
        return;
      }

      const temp = data.main.temp;
      const condition = data.weather[0].main.toLowerCase();
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const cityName = data.name;
      const timezoneOffset = data.timezone;

      const localTimeStr = getLocalTime(timezoneOffset);
      const hour = parseInt(localTimeStr.slice(0, 2));

      document.getElementById("cityName").textContent = `📍 ${cityName}`;
      document.getElementById("description").textContent = `🌤️ ${description}`;
      document.getElementById("temperature").textContent = `🌡️ Temperature: ${temp}°C`;
      document.getElementById("humidity").textContent = `💧 Humidity: ${humidity}%`;
      document.getElementById("wind").textContent = `💨 Wind: ${windSpeed} m/s`;
      document.getElementById("localTime").textContent = `🕓 Local Time: ${localTimeStr}`;

      document.getElementById("weatherResult").classList.remove("hidden");
      setDynamicBackground(condition, hour);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch weather data.");
    });
}

function getLocalTime(offsetInSeconds) {
  const localTime = new Date(Date.now() + offsetInSeconds * 1000);
  return localTime.toUTCString().slice(17, 25); // "HH:MM:SS"
}

function setDynamicBackground(condition, hour) {
  const isNight = hour < 6 || hour > 18;
  const body = document.body;

  if (condition.includes("clear")) {
    body.style.background = isNight
      ? "linear-gradient(to right, #141E30, #243B55)"
      : "linear-gradient(to right, #56CCF2, #2F80ED)";
  } else if (condition.includes("cloud")) {
    body.style.background = isNight
      ? "linear-gradient(to right, #2C3E50, #4CA1AF)"
      : "linear-gradient(to right, #D7D2CC, #304352)";
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
  } else if (condition.includes("thunder")) {
    body.style.background = "linear-gradient(to right, #0F2027, #203A43, #2C5364)";
  } else if (condition.includes("snow")) {
    body.style.background = "linear-gradient(to right, #E0EAFC, #CFDEF3)";
  } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    body.style.background = "linear-gradient(to right, #3E5151, #DECBA4)";
  } else {
    body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
  }
}
