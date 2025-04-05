const express = require('express');
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const { spawn } = require('child_process');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require("bcrypt");
require('dotenv').config();

const app = express();
const port = 5000;

console.log("🚀 Server is starting...");

process.on('uncaughtException', (err) => {
    console.error("❌ Uncaught Exception:", err);
});

process.on('unhandledRejection', (err) => {
    console.error("❌ Unhandled Promise Rejection:", err);
});

const upload = multer({ dest: 'uploads/' });

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
    } else {
        console.log("✅ Connected to SQLite database.");
    }
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const predictionMapping = {
    0: 'Cardio and low-carb diet',
    1: 'Strength training and high-protein diet',
};

function generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}


// User Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to register user' });
            }

            res.status(201).json({ message: 'User registered successfully', user_id: this.lastID });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to hash password or register user' });
    }
});

// User Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Retrieve the user from the database by email
        db.get('SELECT user_id, username, password FROM users WHERE email = ?', [email], async (err, row) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Failed to login' });
            }

            if (!row) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password
            const passwordMatch = await bcrypt.compare(password, row.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Login successful
            res.status(200).json({ message: 'Login successful', user_id: row.user_id, username: row.username });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to login' });
    }
});




app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = path.join(__dirname, req.file.path);

    const pythonProcess = spawn('python', ['predict.py', imagePath]);

    pythonProcess.stdout.on('data', (data) => {
        const prediction = parseInt(data.toString().trim(), 10);
        const result = predictionMapping[prediction] || 'Unknown prediction';
        res.json({ prediction: result });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
        res.status(500).json({ error: 'Error processing image' });
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            res.status(500).json({ error: 'Python script failed' });
        }
    });
});

// Request Password Reset
app.post("/request-reset", (req, res) => {
    const { email } = req.body;
    db.get("SELECT email FROM users WHERE email = ?", [email], (err, row) => {
        if (!row) return res.status(400).json({ error: "Email not registered" });
        
        const token = generateToken();
        db.run("INSERT OR REPLACE INTO tokens (email, token) VALUES (?, ?)", [email, token]);
        
        const mailOptions = {
            from: "redpillfitness@zohomail.in",
            to: email,
            subject: "Password Reset Token",
            text: `Your password reset token is: ${token}`
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) return res.status(500).json({ error: "Failed to send email" });
            res.json({ message: "Token sent to email" });
        });
    });
});

// Reset Password
app.post("/reset-password", async (req, res) => {
    const { email, token, newPassword } = req.body;
    db.get("SELECT token FROM tokens WHERE email = ?", [email], async (err, row) => {
        if (!row || row.token !== token) return res.status(400).json({ error: "Invalid or expired token" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.run("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
            if (err) return res.status(500).json({ error: "Failed to reset password" });
            db.run("DELETE FROM tokens WHERE email = ?", [email]);
            res.json({ message: "Password reset successful" });
        });
    });
});



const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
        user: "redpillfitness@zohomail.in", //process.env.ZOHO_EMAIL, // Hardcoding email
        pass: "G8SKUrhCyguY" // process.env.ZOHO_PASSWORD //  Hardcoding password
    }
});

// Generate random token
function generateToken() {
    return crypto.randomBytes(3).toString("hex");
}


app.listen(port, () => {
    console.log(`🚀 Server running at: http://localhost:${port}`);
});