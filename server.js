const express = require('express');
const cors = require('cors');


const app = express();
const PORT = 3000;

const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/getWeather', async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    console.log("Fetching weather from:", weatherUrl);
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    console.log("Weather API response:", weatherData);

    if (!weatherData || weatherData.cod !== 200) {
      return res.status(500).json({ error: 'Weather API error', details: weatherData });
    }

    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const description = weatherData.weather[0].description;
    const wind = weatherData.wind?.speed;

    const rainExpected = weatherData.weather.some(w => w.main.toLowerCase().includes('rain'));
    const message = rainExpected 
      ? "Rain expected today — spray tomorrow" 
      : "No rain expected — safe to spray today";

    res.json({ temp, humidity, description, wind,rainExpected,message });

  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({ error: 'Error fetching weather', details: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




