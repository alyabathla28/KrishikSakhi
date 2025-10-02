
const farmerId = localStorage.getItem('farmer_id') || 1; 

const oldProjectsCard = document.getElementById('oldProjectsCard');
const projectsModal = document.getElementById('projectsModal');
const projectsList = document.getElementById('projectsList');

oldProjectsCard.addEventListener('click', () => {
    
    fetch(`http://localhost:4000/api/farmer/${farmerId}/projects`)
        .then(res => res.json())
        .then(projects => {
            projectsList.innerHTML = ''; 
            if (projects.length === 0) {
                projectsList.innerHTML = '<p>No old projects found.</p>';
                return;
            }

            projects.forEach(project => {
                const btn = document.createElement('button');
                btn.textContent = `Project ${project.id}`;
                btn.style.cssText = `
                    display:block; width:100%; margin-bottom:8px; padding:8px; border-radius:6px;
                    border:1px solid #064e3b; background:#fff; cursor:pointer; text-align:left;
                `;
                btn.addEventListener('click', () => showProjectDetails(project.id));
                projectsList.appendChild(btn);
            });

            projectsModal.style.display = 'flex';
        })
        .catch(err => console.error(err));
});


function closeProjectsModal() {
    projectsModal.style.display = 'none';
    projectsList.innerHTML = '';
}


function showProjectDetails(projectId) {
    fetch(`http://localhost:4000/api/project/${projectId}`)
        .then(res => res.json())
        .then(project => {
           
            projectsList.innerHTML = `
                <h4 style="color:#064e3b;">Project ${project.id} Details</h4>
                <p><strong>Land Size (acres):</strong> ${project.land_size_acres}</p>
                <p><strong>Soil Type:</strong> ${project.soil_type}</p>
                <p><strong>Water Sources:</strong> ${project.water_sources}</p>
                <p><strong>Budget:</strong> ${project.budget}</p>
                <p><strong>Previous Crop:</strong> ${project.previous_crop_grown}</p>
                <p><strong>Preferred Crops:</strong> ${project.preferred_crops}</p>
                <p><strong>Season:</strong> ${project.season}</p>
                <p><strong>Sowing Month:</strong> ${project.sowing_month}</p>
                <p><strong>Village/Town:</strong> ${project.village_town}</p>
                <p><strong>City:</strong> ${project.city}</p>
                <p><strong>State:</strong> ${project.state}</p>
                <p><strong>Pincode:</strong> ${project.pincode}</p>
                <div style="margin-top:12px; text-align:right;">
                    <button onclick="closeProjectsModal()" style="padding:6px 12px; border:none; border-radius:6px; background:#ccc; cursor:pointer;">Close</button>
                </div>
            `;
        })
        .catch(err => console.error(err));
}

projectsModal.addEventListener('click', (e) => {
    if (e.target === projectsModal) closeProjectsModal();
});
