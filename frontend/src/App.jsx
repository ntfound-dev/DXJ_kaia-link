import React, { useState, useEffect } from 'react';
import liff from '@line/liff';

// Import halaman-halaman utama Anda
import HomePage from './pages/HomePage';
import { WalletProvider } from './contexts/WalletProvider';

// Ambil LIFF ID dari file .env Anda
const LIFF_ID = process.env.REACT_APP_LIFF_ID;

function App() {
  // State untuk melacak status inisialisasi LIFF
  const [liffState, setLiffState] = useState({
    loading: true,
    error: null,
    profile: null,
  });

  // useEffect dengan array kosong [] akan berjalan SATU KALI saja,
  // yaitu setelah komponen App pertama kali ditampilkan di layar.
  useEffect(() => {
    
    const initializeLiff = async () => {
      try {
        // 1. Inisialisasi LIFF
        console.log("Memulai inisialisasi LIFF...");
        await liff.init({ liffId: LIFF_ID });
        console.log("Inisialisasi LIFF berhasil.");

        // 2. Cek apakah pengguna sudah login ke akun LINE-nya
        if (!liff.isLoggedIn()) {
          console.log("Pengguna belum login, mengarahkan ke halaman login LINE...");
          // Jika belum, LIFF akan mengarahkan pengguna ke halaman login LINE,
          // lalu kembali lagi ke aplikasi Anda setelah berhasil.
          liff.login(); 
        } else {
          console.log("Pengguna sudah login.");
          // 3. Jika sudah login, ambil profil pengguna LINE
          const userProfile = await liff.getProfile();
          console.log("Profil LINE didapatkan:", userProfile);
          
          // 4. Simpan status bahwa inisialisasi selesai dan berhasil
          setLiffState({
            loading: false,
            error: null,
            profile: userProfile, // Simpan data profil untuk digunakan nanti
          });
        }
      } catch (error) {
        console.error("Inisialisasi LIFF gagal:", error);
        // Simpan status bahwa inisialisasi gagal
        setLiffState({
          loading: false,
          error: 'Gagal menginisialisasi aplikasi. Harap coba lagi.',
          profile: null,
        });
      }
    };

    initializeLiff();
  }, []); // Array kosong memastikan ini hanya berjalan sekali

  // --- Tampilan Kondisional Berdasarkan Status LIFF ---

  // Tampilkan pesan loading saat LIFF sedang proses inisialisasi
  if (liffState.loading) {
    return <div>Memuat Aplikasi KaiaLink...</div>;
  }

  // Tampilkan pesan error jika inisialisasi gagal
  if (liffState.error) {
    return <div>Error: {liffState.error}</div>;
  }

  // Jika inisialisasi berhasil, tampilkan aplikasi utama Anda
  return (
    <WalletProvider>
      <div className="app-container">
        {/* Anda bisa meneruskan profil LINE ke HomePage jika dibutuhkan */}
        <HomePage lineProfile={liffState.profile} />
      </div>
    </WalletProvider>
  );
}

export default App;