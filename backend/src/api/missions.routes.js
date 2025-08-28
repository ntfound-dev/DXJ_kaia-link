import { Router } from 'express';
import MissionController from '../controllers/missionController.js';
// import { authMiddleware } from '../middlewares/auth.js'; // Penting untuk keamanan

const router = Router();

// Endpoint untuk mendapatkan daftar semua misi yang tersedia
// GET /api/missions
router.get('/', /* authMiddleware, */ MissionController.getAvailableMissions);

// Endpoint untuk mendapatkan signature klaim hadiah (ini alur yang kompleks/terdesentralisasi)
// POST /api/missions/claim-signature
router.post('/claim-signature', /* authMiddleware, */ MissionController.getClaimSignature);

export default router;