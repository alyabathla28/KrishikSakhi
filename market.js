const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.static('public'));
app.use(cors());

// API details and resource ID
const API_KEY = '579b464db66ec23bdd000001befd0607635e4896418897ec46c188e2';
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

app.get('/prices', async (req, res) => {
  try {
    const commodity = req.query.commodity; 
    const state = req.query.state;         
    const district = req.query.district;   
    const limit = req.query.limit || 100; 

    if (!commodity || !state) {
      return res.status(400).json({ message: "Please provide both commodity and state" });
    }

    let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=${limit}&filters[commodity]=${encodeURIComponent(commodity)}&filters[state]=${encodeURIComponent(state)}`;

    if (district) {
      url += `&filters[district]=${encodeURIComponent(district)}`;
    }

    const response = await axios.get(url);

    if (!response.data.records || response.data.records.length === 0) {
      return res.status(404).json({ message: "No records found for this commodity in this state/district" });
    }

    // Map relevant fields to output
    const result = response.data.records.map(r => ({
      date: r.arrival_date,
      state: r.state,
      district: r.district,
      market: r.market,
      commodity: r.commodity,
      variety: r.variety,
      grade: r.grade,
      min_price: r.min_price,
      max_price: r.max_price,
      modal_price: r.modal_price
    }));

    res.json(result);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
