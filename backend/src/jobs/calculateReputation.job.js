import cron from 'node-cron';
import User from '../models/user.model.js';
import ReputationService from '../services/reputation.service.js';

export default class ReputationJob {
    /**
     * @dev Menjalankan CRON job setiap jam untuk mengupdate reputasi semua pengguna.
     */
    static start() {
        // '0 * * * *' artinya "jalankan pada menit ke-0 setiap jam"
        cron.schedule('0 * * * *', async () => {
            console.log('Running hourly reputation calculation job...');
            try {
                // Ambil semua pengguna dari database
                const users = await User.find({});

                // Lakukan update untuk setiap pengguna
                for (const user of users) {
                    const { newScore, newLevel } = await ReputationService.calculateReputationForUser(user.walletAddress);
                    
                    // Update skor di database
                    user.reputationScore = newScore;
                    user.level = newLevel;
                    await user.save();
                    
                    // (Opsional) Panggil smart contract untuk update skor on-chain
                    await ReputationService.updateReputationOnChain(user.walletAddress, newScore, newLevel);
                }
                console.log(`Reputation updated for ${users.length} users.`);
            } catch (error) {
                console.error('Error during reputation job:', error);
            }
        });
    }
}