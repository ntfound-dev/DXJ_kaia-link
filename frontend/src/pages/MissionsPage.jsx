import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useKaiaWallet } from '../contexts/WalletProvider';
import { getMissions, getClaimSignature } from '../services/apiClient';
import MissionRewardABI from '../abi/MissionReward.json'; // Anda harus punya ABI kontraknya

const MISSION_REWARD_CONTRACT_ADDRESS = process.env.REACT_APP_MISSION_REWARD_CONTRACT_ADDRESS;

function MissionsPage() {
    const { signer, address } = useKaiaWallet();
    const [missions, setMissions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // ... kode untuk memuat misi menggunakan getMissions() ...
    }, []);

    const handleClaimReward = async (missionId) => {
        if (!signer) {
            setFeedback("Harap hubungkan dompet Anda terlebih dahulu.");
            return;
        }
        setIsLoading(true);
        setFeedback(`Memproses klaim untuk misi ${missionId}...`);

        try {
            // 1. Minta "tiket" (signature) dari backend
            const { data: { amount, nonce, signature } } = await getClaimSignature(missionId);
            const amountInWei = ethers.parseUnits(amount.toString(), 18); // Konversi ke unit terkecil USDT

            // 2. Buat instance dari smart contract MissionReward
            const missionRewardContract = new ethers.Contract(MISSION_REWARD_CONTRACT_ADDRESS, MissionRewardABI, signer);
            
            // 3. Panggil fungsi `claimReward` di smart contract dengan signature dari backend
            const tx = await missionRewardContract.claimReward(amountInWei, nonce, signature);
            
            setFeedback("Menunggu konfirmasi transaksi...");
            await tx.wait(); // Tunggu sampai transaksi masuk ke blockchain

            setFeedback(`Selamat! Hadiah untuk misi ${missionId} berhasil diklaim!`);
            // (Opsional) Muat ulang data misi atau saldo pengguna
        } catch (error) {
            console.error(error);
            setFeedback(`Gagal mengklaim hadiah: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    // ... return JSX untuk menampilkan daftar misi dengan tombol "Klaim"
    // <button onClick={() => handleClaimReward(mission.id)} disabled={isLoading}>
    //    {isLoading ? 'Memproses...' : 'Klaim Hadiah'}
    // </button>
}