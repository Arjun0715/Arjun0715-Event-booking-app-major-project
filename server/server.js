// server/server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
import express from "express";
import  mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 7000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Define a simple Event Schema and Model
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  
});
 const Event  = mongoose.model('Event', eventSchema);

// Define a Registration Schema and Model
const registrationSchema = new mongoose.Schema({
    eventId : { type: mongoose.Schema.Types.ObjectId, 
      ref : `${Event} `},
    name: String,
    email: String
});
const Registration= mongoose.model('Registration', registrationSchema);


// --- API Routes ---

// GET: Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
    
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Register a user for an event
app.post('/api/register', async (req, res) => {
    const { eventId } = req.body;
  const {name ,email}=req.body;
    if (!eventId ||!name || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
  
    }

    try {
        const newRegistration = new Registration({
            eventId,
            name,
            email
        });
        await newRegistration.save();
        res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// (Optional) Add a route to pre-populate some event data
app.get('/api/seed', async (req, res) => {
    await Event.deleteMany({}); // Clear existing events
    const events = [
       { title: 'Wings of Light 2025', description: 'flying of sky candle lamps with lots of hopes.', date: new Date('2025-10-20T15:00:00'), location: 'Grounds Of Heaven' },
        { title: 'Tech Conference 2025', description: 'Annual tech conference with top speakers.', date: new Date('2025-11-15T09:00:00'), location: 'Metro Convention Hall' },
        { title: 'Local Music Festival', description: 'Featuring the best local bands.', date: new Date('2025-10-25T15:00:00'), location: 'City Park' },
        { title: 'Art & Design Workshop', description: 'Hands-on workshop for aspiring artists.', date: new Date('2025-12-05T11:00:00'), location: 'Creative Studio' },
    ];
    await Event.insertMany(events);
    res.send('Database seeded with sample events!');
    
});


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});