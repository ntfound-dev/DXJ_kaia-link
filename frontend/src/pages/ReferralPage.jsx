import { useKaiaWallet } from '../contexts/WalletProvider';
import liff from '@line/liff'; // Import LIFF SDK

function ReferralPage() {
    const { address } = useKaiaWallet();
    const referralLink = `https://kaialink.com/join?ref=${address}`; // Contoh link referral

    const handleShareOnLine = async () => {
        if (!liff.isInClient()) {
            alert("Fitur ini hanya tersedia di dalam aplikasi LINE.");
            return;
        }

        // Menggunakan LIFF Share Target Picker untuk berbagi ke teman/grup
        try {
            await liff.shareTargetPicker([
                {
                    type: 'text',
                    text: `Hai! Gabung di KaiaLink dan dapatkan hadiah USDT. Gunakan link referral saya: ${referralLink}`
                }
            ]);
        } catch (error) {
            console.error('Gagal membuka share target picker:', error);
        }
    };

    return (
        <div>
            <h2>Undang Teman, Dapatkan Hadiah!</h2>
            <p>Bagikan link unik Anda:</p>
            <input type="text" value={referralLink} readOnly />
            <button onClick={handleShareOnLine}>
                Bagikan di LINE
            </button>
            {/* ... Tampilkan statistik referral di sini ... */}
        </div>
    );
}