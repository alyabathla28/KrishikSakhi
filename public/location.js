const geoBtn = document.getElementById("geoBtn");
const geoStatus = document.getElementById("geoStatus");

geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    geoStatus.innerText = "Getting your location...";
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lon;

        geoStatus.innerText = `Location detected! Latitude: ${lat.toFixed(5)}, Longitude: ${lon.toFixed(5)}`;
        geoStatus.style.color = "green";

        if (typeof fetchWeather === "function") {
          fetchWeather();
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            geoStatus.innerText = "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            geoStatus.innerText = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            geoStatus.innerText = "The request to get user location timed out.";
            break;
          default:
            geoStatus.innerText = "An unknown error occurred.";
            break;
        }
        geoStatus.style.color = "red";
      }
    );
  } else {
    geoStatus.innerText = "Geolocation is not supported by this browser.";
    geoStatus.style.color = "red";
  }
});
