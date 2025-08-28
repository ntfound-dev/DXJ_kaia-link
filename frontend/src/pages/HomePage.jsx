import React, { useState, useEffect } from 'react';
import { useKaiaWallet } from '../contexts/WalletProvider';
import { getProfile } from '../services/apiClient';
import WalletConnectButton from '../components/WalletConnectButton';
// Anggap Anda punya komponen untuk navigasi
// import Navigation from '../components/Navigation';

function HomePage() {
    const { address } = useKaiaWallet();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect ini akan berjalan setiap kali 'address' berubah (misal, setelah connect)
    useEffect(() => {
        // Jika ada alamat (sudah connect), ambil data profil dari backend
        if (address) {
            setIsLoading(true);
            getProfile()
                .then(response => {
                    setUserProfile(response.data);
                })
                .catch(error => {
                    console.error("Gagal mengambil profil:", error);
                    // Mungkin user baru dan belum punya profil, tangani di sini
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            // Jika disconnect, reset profil
            setUserProfile(null);
        }
    }, [address]);

    return (
        <div className="homepage-container">
            <header className="app-header">
                <h1>Selamat Datang di KaiaLink</h1>
                <WalletConnectButton />
            </header>

            <main className="main-content">
                {!address ? (
                    // Tampilan saat belum connect
                    <div className="welcome-message">
                        <h2>Hubungkan dompet Anda untuk memulai petualangan DeFi Anda!</h2>
                    </div>
                ) : isLoading ? (
                    // Tampilan saat sedang loading profil
                    <p>Memuat data Anda...</p>
                ) : userProfile ? (
                    // Tampilan dashboard setelah connect dan profil dimuat
                    <div className="dashboard">
                        <h2>Halo, {address.substring(0, 6)}...</h2>
                        <div className="profile-summary">
                            <p>Level: {userProfile.level}</p>
                            <p>Skor Reputasi: {userProfile.reputationScore}</p>
                        </div>
                        {/* <Navigation /> */}
                        {/* Di sini Anda bisa menambahkan link ke halaman Misi atau Profil Detail */}
                    </div>
                ) : (
                    <p>Gagal memuat profil atau Anda adalah pengguna baru.</p>
                )}
            </main>
        </div>
    );
}

export default HomePage;