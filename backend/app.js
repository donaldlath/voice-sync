const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const syncRoutes = require('./routes/syncRoutes');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sync', syncRoutes);
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
