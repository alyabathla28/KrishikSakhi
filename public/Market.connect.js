
let chart;

async function fetchPrice() {
  const commodity = document.getElementById("commodity").value;
  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;
  const errorEl = document.getElementById("error");

  errorEl.textContent = "";
  if (!commodity || !state || !district) {
    errorEl.textContent = "Please enter commodity, state, and city/district.";
    return;
  }

  try {
    const url = `http://localhost:5000/prices?commodity=${encodeURIComponent(commodity)}&state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Error fetching data");
    }

    if (!data.length) {
      throw new Error("No data found for the selected filters.");
    }

    // Take the first record only
    const record = data[0];

    const ctx = document.getElementById('priceChart').getContext('2d');

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Min Price', 'Max Price', 'Modal Price'],
        datasets: [{
          label: `${commodity.toUpperCase()} Price in ${district.toUpperCase()}`,
          data: [Number(record.min_price), Number(record.max_price), Number(record.modal_price)],
          backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(255, 206, 86, 0.7)']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `Prices for ${commodity.toUpperCase()} in ${district.toUpperCase()}`
          }
        },
            scales: {
      y: {
        ticks: {
          callback: function(value) {
            return value + " /quintal";  // 👈 Add unit here
          }
        }
      }
    }
      }
    });

  } catch (err) {
    errorEl.textContent = err.message;
  }
}

