import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Alamat dompet Kaia, unik dan menjadi kunci utama
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true, // Untuk pencarian cepat
    },
    // ID unik dari LINE (opsional, untuk fitur sosial)
    lineId: {
        type: String,
        unique: true,
        sparse: true, // Izinkan null/kosong untuk unik
    },
    reputationScore: {
        type: Number,
        default: 0,
    },
    experiencePoints: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
    // Nonce untuk klaim hadiah di MissionReward.sol, sangat penting!
    rewardNonce: {
        type: Number,
        default: 0,
    },
    // Rekomendasi investasi yang dihasilkan AI
    aiRecommendation: {
        vaultAddress: String,
        generatedAt: Date,
    }
}, { timestamps: true }); // Otomatis menambahkan createdAt dan updatedAt

const User = mongoose.model('User', userSchema);
export default User;