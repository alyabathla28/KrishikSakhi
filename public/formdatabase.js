
function updateBudgetValue(val) {
  document.getElementById("budgetValue").innerText = val;
}

document.getElementById("projectForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  // Use the stored farmer ID directly
  const farmer_id = localStorage.getItem("farmer_id");
  if (!farmer_id) {
    alert("Farmer not logged in!");
    return;
  }

  // Collect other form values
  const land_size_acres = parseFloat(document.getElementById("land").value);
  const soil_type = document.getElementById("soil").value;
  const waterSources = Array.from(document.querySelectorAll('input[name="water"]:checked')).map(cb => cb.value);
  if (waterSources.length === 0) { alert("Please select at least one water source."); return; }
  const budget = parseInt(document.getElementById("budget").value);
  const previous_crop_grown = document.getElementById("previous").value;
  const preferred_crops = document.getElementById("preferred").value;
  const season = document.getElementById("season").value.split(" ")[0];
  const sowing_month = document.getElementById("sowing").value;
  const village_town = document.getElementById("village").value;
  const city = document.getElementById("city").value;
  const state = document.getElementById("state").value;
  const pincode = parseInt(document.getElementById("pincode").value);

  const projectData = {
    farmer_id,
    land_size_acres,
    soil_type,
    water_sources: waterSources,
    budget,
    previous_crop_grown,
    preferred_crops,
    season,
    sowing_month,
    village_town,
    city,
    state,
    pincode
  };

  fetch('http://localhost:4000/api/project/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) alert("Error: " + data.error);
    else {
      alert("Project submitted successfully! Project ID: " + data.project_id);
      document.getElementById("projectForm").reset();
      document.getElementById("budgetValue").innerText = 20000;
    }
  })
  .catch(err => { console.error(err); alert("An error occurred while submitting the project."); });
});
