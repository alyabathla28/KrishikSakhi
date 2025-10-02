// Parse JWT returned by Google 
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
}

function handleCredentialResponse(response) {
    const data = parseJwt(response.credential);

    const user = {
        google_id: data.sub,
        full_name: data.name,
        profile_pic: data.picture,
        email: data.email
    };

    // Send user to backend
    fetch("http://localhost:4000/api/farmer/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(result => {
        // Save to localStorage BEFORE redirect
        localStorage.setItem('farmer_id', result.farmer_id);
        localStorage.setItem('farmer_name', user.full_name);
        localStorage.setItem('farmer_pic', user.profile_pic);

        console.log("Saved in localStorage:", {
            name: localStorage.getItem('farmer_name'),
            pic: localStorage.getItem('farmer_pic')
        });

        // Redirect to dashboard
        window.location.href = "http://127.0.0.1:5502/public/features.html";
    })
    .catch(err => console.error("Google login error:", err));
}
