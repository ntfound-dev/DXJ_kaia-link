import User from '../../models/user.model.js';
import { getOnChainVaultData, getOnChainUserActivity } from '../blockchain.service.js';
import { calculateCosineSimilarity } from '../../utils/math.js'; // Helper matematika

export default class RecommendationService {

    /**
     * @dev Fungsi utama yang akan dijalankan oleh CRON job.
     */
    static async generateAndStoreRecommendations() {
        const users = await User.find({ level: { $gt: 5 } });
        const vaults = await getOnChainVaultData(); // Mendapat data & skor semua vault

        const strategyVectors = vaults.map(this._vectorizeStrategy);

        for (const user of users) {
            // Langkah 1: Buat vektor untuk pengguna
            const userVector = await this._vectorizeUser(user);
            
            // Langkah 3: Temukan pasangan terbaik
            const bestMatch = this._findBestMatch(userVector, strategyVectors);

            // Langkah 4: Simpan rekomendasi
            if (bestMatch) {
                user.aiRecommendation = { vaultAddress: bestMatch.address, score: bestMatch.similarityScore, generatedAt: new Date() };
                await user.save();
            }
        }
    }

    /**
     * @dev Membuat profil multi-dimensi (vektor) untuk seorang pengguna.
     * @private
     */
    static async _vectorizeUser(user) {
        const onChainActivity = await getOnChainUserActivity(user.walletAddress);
        
        const userVector = {
            riskAppetite: onChainActivity.degenScore,
            timeHorizon: user.avgStakingDuration,
            capitalSize: onChainActivity.avgBalance,
            activityFrequency: onChainActivity.txPerWeek,
            platformLoyalty: user.internalActivityRatio
        };
        // Lakukan normalisasi data (mengubah semua nilai menjadi antara 0 dan 1)
        return this._normalize(userVector);
    }

    /**
     * @dev Membuat profil multi-dimensi (vektor) untuk sebuah strategi investasi.
     * @private
     */
    static _vectorizeStrategy(vault) {
        const strategyVector = {
            riskFactor: vault.riskScore,
            rewardPotential: vault.apy,
            lockupDuration: vault.lockupPeriod,
            // ... dimensi lainnya
        };
        return this._normalize(strategyVector);
    }

    /**
     * @dev Menjalankan algoritma pencocokan untuk menemukan vault terbaik.
     * @private
     */
    static _findBestMatch(userVector, strategyVectors) {
        let bestMatch = { address: null, similarityScore: -1 };

        for (const strategyVector of strategyVectors) {
            const similarity = calculateCosineSimilarity(userVector, strategyVector.vector);
            if (similarity > bestMatch.similarityScore) {
                bestMatch = { address: strategyVector.address, similarityScore: similarity };
            }
        }
        return bestMatch.similarityScore > 0.7 ? bestMatch : null; // Hanya rekomendasikan jika tingkat kemiripan tinggi
    }
    
    /**
     * @dev Helper untuk normalisasi data.
     * @private
     */
    static _normalize(vector) { /* ... logika normalisasi ... */ return vector; }
}