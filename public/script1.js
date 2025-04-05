// script1.js

const API_URL = "http://localhost:5000"; // Make sure this matches your backend

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// Function to get query parameters from URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Check if the action is signup from query parameter
const action = getQueryParam('action');

if (action === 'signup') {
    container.classList.add("active"); // Show signup form
}

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });
}
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
}


// Registration Function
async function registerUser(username, email, password) {
    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            // Optionally, redirect to the login page or automatically log the user in
            container.classList.remove("active")
        } else {
            alert('Registration failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed due to a network error.');
    }
}

// Signup Function (Fix for missing signup function)
function signup() {
    console.log("Signup button clicked!"); // Debugging

    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!username || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    registerUser(username, email, password);
}

// Ensure signup() is globally accessible
window.signup = signup;



// Login Function
async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            // Store the user_id and username in localStorage
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('username', data.username);

            // Redirect to the dashboard or main page
            window.location.href = 'index1.html';
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Login failed due to a network error.');
    }
}

// Attach event listeners to the forms (assuming you have forms with IDs)
document.querySelector('.sign-up form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.querySelector('.sign-up form input[type="text"]').value;
    const email = document.querySelector('.sign-up form input[type="email"]').value;
    const password = document.querySelector('.sign-up form input[type="password"]').value;
    await registerUser(username, email, password);
});

document.querySelector('.sign-in form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('.sign-in form input[type="email"]').value;
    const password = document.querySelector('.sign-in form input[type="password"]').value;
    await loginUser(email, password);
});


// Sign-In Function (Fix for missing signin function)
function signin() {
    console.log("Signin button clicked!"); // Debugging

    const email = document.getElementById("signin-email").value.trim();
    const password = document.getElementById("signin-password").value.trim();

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    loginUser(email, password);
}

// Ensure signin() is globally accessible
window.signin = signin;


async function requestReset() {
    const email = document.getElementById("reset-email").value.trim();
    if (!email) return alert("Please enter your email!");

    try {
        const response = await fetch(`${API_URL}/request-reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();
        alert(result.message || result.error);

        if (result.message) {
            showResetPassword(); // Show reset form if request successful
        }
    } catch (error) {
        alert("Error sending reset request.");
        console.error(error);
    }
}

async function resetPassword() {
    const email = document.getElementById("reset-token-email").value.trim();
    const token = document.getElementById("reset-token").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();

    if (!email || !token || !newPassword) return alert("Please fill in all fields!");

    try {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, newPassword }),
        });

        const result = await response.json();
        alert(result.message || result.error);

        if (result.message === "Password reset successful") {
            alert("Your password has been changed! Please login.");
            showLogin(); // Redirect to login form
        }
    } catch (error) {
        alert("Error resetting password.");
        console.error(error);
    }
}

// Ensure functions are accessible globally
window.requestReset = requestReset;
window.resetPassword = resetPassword;