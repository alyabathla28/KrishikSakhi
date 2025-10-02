-- Stores the main user/farmer information (login details).
CREATE TABLE IF NOT EXISTS Farmers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    profile_pic TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  IF NOT EXISTS Projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,

    -- Land and Soil Details
    land_size_acres REAL NOT NULL, -- Storing as REAL for decimal values 
    soil_type TEXT NOT NULL CHECK(soil_type IN ('Alluvial', 'Black', 'Red', 'Laterite', 'Mountain/Forest', 'Desert', 'Other')),

    -- Water and Budget
    water_sources TEXT, -- Storing multiple selections as a comma-separated string 
    budget INTEGER,     

    -- Cropping Plan
    previous_crop_grown TEXT,
    preferred_crops TEXT NOT NULL,
    season TEXT NOT NULL CHECK(season IN ('Kharif', 'Rabi', 'Zaid')),
    sowing_month TEXT NOT NULL,

    -- Location Details
    village_town TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES Farmers(id)
);

-- Stores the conversation history for each farmer.
CREATE TABLE  IF NOT EXISTS ChatHistory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES Farmers(id)
);

CREATE TABLE  IF NOT EXISTS Advisory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_id INTEGER,
    issue_type TEXT,
    title TEXT NOT NULL,
    content_malayalam TEXT,
    content_english TEXT
);

