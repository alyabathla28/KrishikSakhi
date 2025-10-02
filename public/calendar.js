// Crop growth duration in days
const cropGrowthDays = {
  wheat: 120, rice: 150, corn: 90, barley: 110, oats: 100, soybean: 95,
  sunflower: 85, sugarcane: 365, cotton: 180, tomato: 75, potato: 90,
  onion: 120, garlic: 150, chili: 80, cabbage: 70, maize: 100
};

// Irrigation frequency in days
const cropIrrigationDays = {
  wheat: 7, rice: 3, corn: 10, barley: 8, oats: 9, soybean: 7,
  sunflower: 10, sugarcane: 14, cotton: 12, tomato: 4, potato: 5,
  onion: 6, garlic: 7, chili: 5, cabbage: 5, maize: 10
};

let sowingAlerts = [];      
let irrigationAlerts = [];  

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  let selectedDate = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    select: function(info) {
      selectedDate = info.startStr;
      document.getElementById('eventModal').style.display = 'flex';
    }
  });
  calendar.render();

  const modal = document.getElementById('eventModal');
  const eventType = document.getElementById('eventType');

  document.getElementById('cancelBtn').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  const alertsDiv = document.querySelector('.alerts');

  function updateCountdowns() {
    const today = new Date();

    sowingAlerts.forEach(alert => {
      const diffDays = Math.max(Math.ceil((alert.harvestDate - today) / (1000*60*60*24)), 0);
      alert.alertElement.textContent = `🌱 ${alert.crop.charAt(0).toUpperCase() + alert.crop.slice(1)} planted! ${diffDays} days left to harvest your field.`;
    });

    irrigationAlerts.forEach(alert => {
      const diffDays = Math.max(Math.ceil((alert.nextIrrigationDate - today) / (1000*60*60*24)), 0);
      alert.alertElement.textContent = `💧 ${alert.crop.charAt(0).toUpperCase() + alert.crop.slice(1)}: irrigate your field after ${diffDays} days.`;
    });
  }

  // for demo it updates every min otherwise can be set for day
  setInterval(updateCountdowns, 1000 * 60);

  document.getElementById('saveBtn').addEventListener('click', () => {
    const cropSelect = document.getElementById('cropSelect');
    const crop = cropSelect.value;
    const type = eventType.value;
    if (!crop) return;

    const selected = new Date(selectedDate);

    if (type === 'sowing') {
      const harvestDate = new Date(selected.getTime() + cropGrowthDays[crop]*24*60*60*1000);

      const harvestAlert = document.createElement('div');
      harvestAlert.classList.add('alert-item');
      alertsDiv.appendChild(harvestAlert);

      sowingAlerts.push({crop, harvestDate, alertElement: harvestAlert});
      updateCountdowns(); 
    }

    if (type === 'irrigation') {
      
      for (let i = irrigationAlerts.length - 1; i >= 0; i--) {
        if (irrigationAlerts[i].crop === crop) {
          irrigationAlerts[i].alertElement.remove();
          irrigationAlerts.splice(i, 1);
        }
      }

      const nextIrrigationDate = new Date(selected.getTime() + cropIrrigationDays[crop]*24*60*60*1000);
      const irrigationAlert = document.createElement('div');
      irrigationAlert.classList.add('alert-item');
      alertsDiv.appendChild(irrigationAlert);

      irrigationAlerts.push({crop, nextIrrigationDate, alertElement: irrigationAlert});
      updateCountdowns(); 
    }

    if (type === 'harvesting') {
      const harvestAlert = document.createElement('div');
      harvestAlert.classList.add('alert-item');
      harvestAlert.textContent = `🌾 ${crop.charAt(0).toUpperCase() + crop.slice(1)} harvested today!`;
      alertsDiv.appendChild(harvestAlert);
    }

    let title = type === 'sowing' ? '🌱 Sowing' : type === 'harvesting' ? '🌾 Harvesting' : '💧 Irrigation';
    if (crop) title += ` (${crop})`;

    calendar.addEvent({
      title,
      start: selectedDate,
      extendedProps: { crop }
    });

    modal.style.display = 'none';
    cropSelect.value = '';
  });
});
