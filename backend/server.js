// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // JSON data parse karne ke liye
app.use(cors()); // React se connection allow karne ke liye

// MongoDB Connection
// Yahan apni MongoDB URI daal (Local ya Atlas)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/emitraDB')
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- MONGODB SCHEMA (MODEL) ---
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, default: "₹0" },
  icon: { type: String, default: "FaFileAlt" }, // Icon ka naam store karenge
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now }
});

const Service = mongoose.model('Service', serviceSchema);

// --- API ROUTES ---

// 1. Get All Services (Read)
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// 2. Add New Service (Create)
app.post('/api/services', async (req, res) => {
  try {
    const newService = new Service(req.body);
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (err) {
    res.status(400).json({ error: "Failed to add service" });
  }
});

// 3. Update Service (Update)
app.put('/api/services/:id', async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ error: "Failed to update service" });
  }
});

// 4. Delete Service (Delete)
app.delete('/api/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service Deleted Successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete service" });
  }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});