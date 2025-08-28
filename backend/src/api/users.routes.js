import { Router } from 'express';
import UserController from '../controllers/userController.js';
// Misalkan Anda punya middleware untuk verifikasi token/signature dari frontend
// import { authMiddleware } from '../middlewares/auth.js'; 

const router = Router();

// [PRIVAT] Mendapatkan profil lengkap dari pengguna yang sedang login.
// GET /api/users/profile
router.get('/profile', /* authMiddleware, */ UserController.getOwnProfile);

// [PUBLIK] Mendapatkan profil sederhana dari pengguna mana pun berdasarkan alamat.
// GET /api/users/0x123...abc/profile
router.get('/:walletAddress/profile', UserController.getPublicProfile);

// [PRIVAT] Menautkan akun LINE ke profil dompet pengguna.
// POST /api/users/link-line
router.post('/link-line', /* authMiddleware, */ UserController.linkLineAccount);

export default router;