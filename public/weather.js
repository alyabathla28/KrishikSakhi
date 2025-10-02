async function fetchWeather() {
  try {
    const latInput = document.getElementById("latitude");
    const lonInput = document.getElementById("longitude");

    if (!latInput || !lonInput) {
      console.warn("Latitude/Longitude inputs not found yet");
      return;
    }

    const lat = latInput.value;
    const lon = lonInput.value;

    if (!lat || !lon) {
      console.warn("Latitude/Longitude not set yet");
      return;
    }

    const bodyData = { latitude: lat, longitude: lon };

    const res = await fetch('http://localhost:3000/getWeather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json(); 

    if (data.error) {
      document.getElementById('temp').innerText = "N/A";
      document.getElementById('meta').innerText = "Weather unavailable";
      return;
    }

    document.getElementById('temp').innerText = `${data.temp}°C`;
    document.getElementById('meta').innerText =
      `${data.description} • Humidity ${data.humidity}% • Wind ${data.wind} km/h`;
    document.getElementById('lastUpdated').innerText =
      "Last updated: " + new Date().toLocaleString();

    const alertsContainer = document.querySelector(".alerts");
    if (alertsContainer && data.message) {

      const oldAlert = alertsContainer.querySelector(".alert-item.weather-alert");
      if (oldAlert) oldAlert.remove();

      const newAlert = document.createElement("div");
      newAlert.className = "alert-item weather-alert";
      newAlert.innerHTML = `
        <strong>Weather Alert</strong>
        <div class="small">${data.message}</div>
      `;

      const note = alertsContainer.querySelector(".small-note");
      alertsContainer.insertBefore(newAlert, note);
    }

  } catch (err) {
    console.error("Error fetching weather:", err);
    const meta = document.getElementById('meta');
    if (meta) meta.innerText = "Error loading weather";
  }
}
