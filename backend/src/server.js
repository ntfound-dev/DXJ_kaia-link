import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import Rute
import userRoutes from './api/users.routes.js';
import missionRoutes from './api/missions.routes.js';

// Import CRON Jobs
import ReputationJob from './jobs/calculateReputation.job.js';
import AIRecommendationJob from './jobs/aiRecommendation.job.js'; // Asumsikan Anda membuat file job untuk AI

// --- Konfigurasi Awal ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// --- Koneksi Database ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Berhasil terhubung ke MongoDB.'))
    .catch(err => console.error('Koneksi MongoDB gagal:', err));

// --- Middleware ---
app.use(cors()); // Mengizinkan request dari domain lain (penting untuk Mini dApp)
app.use(express.json()); // Mem-parsing body request JSON

// --- Mounting Rute API ---
app.use('/api/users', userRoutes);
app.use('/api/missions', missionRoutes);

// --- Menjalankan CRON Jobs ---
ReputationJob.start();
// AIRecommendationJob.start(); // Jalankan job AI

// --- Menjalankan Server ---
app.listen(PORT, () => {
    console.log(`Server KaiaLink berjalan di port ${PORT}`);
    console.log(`Waktu server saat ini: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })}`);
});