window.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('farmer_name') || 'Farmer';
    const pic = localStorage.getItem('farmer_pic');

    // Update greeting
    document.getElementById('userName').innerText = `Hello, ${name}`;

    // Update avatar
    const avatarEl = document.getElementById('userAvatar');
    avatarEl.innerHTML = '';
    if (pic) {
        const img = document.createElement('img');
        img.src = pic;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.borderRadius = '50%';
        avatarEl.appendChild(img);
    } else {
        avatarEl.innerText = name[0]; // fallback
    }
});

