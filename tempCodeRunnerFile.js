const fs = require('fs');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());
app.use(express.static('public'));

const cors = require('cors');
app.use(cors());

const DB_SOURCE = 'farmers_kerala.db';

// Read the schema file
const schema = fs.readFileSync('schema.sql', 'utf8');

// Connect to the SQLite database
let db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');

        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON;');

        // Run schema (only creates tables if not existing)
        db.exec(schema, (err) => {
            if (err) {
                console.error("Error executing schema:", err.message);
            } else {
                console.log("Database schema ensured.");
            }
        });
    }
});

app.get("/", (req, res) => {
    console.log("Root / route was hit!");
    res.send("Server is working!");
});


//Farmer Signup
app.post("/api/farmer/signup", (req, res) => {
    const { full_name, phone_number, password_hash } = req.body;
    const sql = `INSERT INTO Farmers (full_name, phone_number, password_hash) VALUES (?, ?, ?)`;

    db.run(sql, [full_name, phone_number, password_hash], function (err) {
        if (err) {
            // Check for UNIQUE constraint violation
            if (err.message.includes("UNIQUE constraint failed: Farmers.phone_number")) {
                return res.status(409).json({ "error": "Phone number already exists." });
            }
            return res.status(400).json({ "error": err.message });
        }
        res.status(201).json({
            "message": "Farmer registered successfully!",
            "farmer_id": this.lastID
        });
    });
});


// NEW: Endpoint for "Submit Project" button
app.post("/api/project/create", (req, res) => {
    const data = req.body;
    const {
        farmer_id, land_size_acres, soil_type, water_sources, budget,
        previous_crop_grown, preferred_crops, season, sowing_month,
        village_town, city, state, pincode
    } = data;

    if (!farmer_id) {
        return res.status(400).json({ "error": "Farmer ID is missing." });
    }

    const water_sources_str = Array.isArray(water_sources) ? water_sources.join(',') : '';

    const sql = `
        INSERT INTO Projects (
            farmer_id, land_size_acres, soil_type, water_sources, budget,
            previous_crop_grown, preferred_crops, season, sowing_month,
            village_town, city, state, pincode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        farmer_id, land_size_acres, soil_type, water_sources_str, budget,
        previous_crop_grown, preferred_crops, season, sowing_month,
        village_town, city, state, pincode
    ];

    db.run(sql, params, function(err) {
        if (err) {
            return res.status(500).json({ "error": err.message });
        }
        res.status(201).json({
            "message": "Project created successfully!",
            "project_id": this.lastID
        });
    });
});


// UPDATED: Get all projects for a specific farmer
app.get("/api/farmer/:farmer_id/projects", (req, res) => {
    const sql = "SELECT * FROM Projects WHERE farmer_id = ?";
    const params = [req.params.farmer_id];

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        res.json(rows);
    });
});

// Google Login / Signup 
app.post("/api/farmer/google-login", (req, res) => {
    const { google_id, full_name, profile_pic, email } = req.body;

    if (!google_id || !full_name) {
        return res.status(400).json({ error: "Missing Google ID or name" });
    }

    // Check if farmer exists
    const sqlCheck = "SELECT * FROM Farmers WHERE google_id = ?";
    db.get(sqlCheck, [google_id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            // Update existing profile picture and name
            const sqlUpdate = "UPDATE Farmers SET full_name = ?, profile_pic = ? WHERE google_id = ?";
            db.run(sqlUpdate, [full_name, profile_pic, google_id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Farmer updated", farmer_id: row.id });
            });
        } else {
            // Insert new farmer
            const sqlInsert = "INSERT INTO Farmers (google_id, full_name, profile_pic, created_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)";
            db.run(sqlInsert, [google_id, full_name, profile_pic], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Farmer created", farmer_id: this.lastID });
            });
        }
    });
});


const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});