import UserService from '../services/user.service.js';
import { verifyLineToken } from '../services/line.service.js'; // Service eksternal

export default class UserController {

    /**
     * @dev Mengambil profil LENGKAP milik pengguna yang terotentikasi.
     */
    static async getOwnProfile(req, res) {
        try {
            // Misalkan walletAddress didapat dari middleware otentikasi
            const { walletAddress } = req.user; 
            const userProfile = await UserService.getFullUserProfile(walletAddress);
            if (!userProfile) {
                return res.status(404).json({ message: "Profil tidak ditemukan." });
            }
            res.status(200).json(userProfile);
        } catch (error) {
            res.status(500).json({ message: "Gagal mengambil profil.", error: error.message });
        }
    }

    /**
     * @dev Mengambil profil PUBLIK (data terbatas) dari alamat dompet mana pun.
     */
    static async getPublicProfile(req, res) {
        try {
            const { walletAddress } = req.params;
            const publicProfile = await UserService.getPublicUserProfile(walletAddress);
            if (!publicProfile) {
                return res.status(404).json({ message: "Profil tidak ditemukan." });
            }
            res.status(200).json(publicProfile);
        } catch (error) {
            // ... error handling
        }
    }

    /**
     * @dev Menautkan LINE ID ke profil setelah verifikasi token dari LINE.
     */
    static async linkLineAccount(req, res) {
        try {
            const { walletAddress } = req.user;
            const { lineIdToken } = req.body; // Frontend mengirim token yang didapat dari LINE Login SDK

            // Verifikasi token ke server LINE untuk memastikan keasliannya
            const lineProfile = await verifyLineToken(lineIdToken);
            if (!lineProfile || !lineProfile.sub) {
                 return res.status(401).json({ message: "Token LINE tidak valid." });
            }

            // Panggil service untuk menyimpan lineId ke database pengguna
            await UserService.linkLineId(walletAddress, lineProfile.sub); // lineProfile.sub adalah ID unik pengguna LINE

            res.status(200).json({ message: "Akun LINE berhasil ditautkan." });
        } catch (error) {
            // ... error handling
        }
    }
}