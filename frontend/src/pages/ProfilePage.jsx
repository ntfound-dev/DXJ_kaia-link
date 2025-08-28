import React, { useState, useEffect } from 'react';
import { useKaiaWallet } from '../contexts/WalletProvider';
import { getProfile } from '../services/apiClient';
import WalletConnectButton from '../components/WalletConnectButton';

function ProfilePage() {
    const { address, balance } = useKaiaWallet(); // Ambil data on-chain dari hook
    const [profileData, setProfileData] = useState(null); // State untuk data off-chain dari backend
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (address) {
            setIsLoading(true);
            getProfile()
                .then(response => {
                    setProfileData(response.data);
                })
                .catch(error => console.error("Gagal memuat data profil:", error))
                .finally(() => setIsLoading(false));
        }
    }, [address]);
    
    if (!address) {
        return (
            <div>
                <h2>Harap hubungkan dompet untuk melihat profil.</h2>
                <WalletConnectButton />
            </div>
        );
    }
    
    if (isLoading) {
        return <p>Memuat profil...</p>;
    }

    return (
        <div className="profile-page">
            <h2>Profil Saya</h2>
            
            <section className="profile-section">
                <h3>Data On-Chain</h3>
                <p><strong>Alamat Dompet:</strong> {address}</p>
                <p><strong>Saldo KAIA:</strong> {parseFloat(balance).toFixed(4)} KAIA</p>
            </section>
            
            {profileData && (
                <section className="profile-section">
                    <h3>Profil KaiaLink (Off-Chain)</h3>
                    <p><strong>Level:</strong> {profileData.level}</p>
                    <p><strong>Poin Pengalaman (XP):</strong> {profileData.experiencePoints}</p>
                    <p><strong>Skor Reputasi:</strong> {profileData.reputationScore}</p>
                </section>
            )}
            
            {profileData && profileData.aiRecommendation && (
                <section className="profile-section ai-recommendation">
                    <h3>✨ Rekomendasi Investasi AI untuk Anda ✨</h3>
                    <p>Berdasarkan profil Anda, kami merekomendasikan untuk mencoba berinvestasi di:</p>
                    <p className="vault-address"><strong>Vault:</strong> {profileData.aiRecommendation.vaultAddress}</p>
                </section>
            )}
        </div>
    );
}

export default ProfilePage;