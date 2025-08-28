import MissionService from '../services/mission.service.js';
import User from '../models/user.model.js';

export default class MissionController {

    static async getAvailableMissions(req, res) {
        // ... Logika untuk mengambil daftar misi
    }

    /**
     * @dev Membuat signature untuk klaim hadiah, bukan mengirim hadiah langsung.
     */
    static async getClaimSignature(req, res) {
        try {
            const { walletAddress } = req.user; // Diambil dari authMiddleware
            const { missionId } = req.body;

            // 1. Validasi apakah misi benar-benar sudah selesai oleh pengguna
            const isCompleted = await MissionService.verifyMissionCompletion(walletAddress, missionId);
            if (!isCompleted) {
                return res.status(400).json({ message: "Misi belum selesai atau tidak valid." });
            }

            // 2. Ambil data pengguna untuk mendapatkan nonce saat ini
            const user = await User.findOne({ walletAddress });
            const amount = MissionService.getRewardAmount(missionId);
            const nonce = user.rewardNonce;

            // 3. Panggil service untuk membuat signature
            const signature = await MissionService.signRewardClaim(walletAddress, amount, nonce);
            
            // 4. Kirim signature ke frontend agar bisa dipakai untuk klaim di smart contract
            res.status(200).json({ amount, nonce, signature });

        } catch (error) {
            res.status(500).json({ message: "Gagal membuat signature.", error: error.message });
        }
    }
}