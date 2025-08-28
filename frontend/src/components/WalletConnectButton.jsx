import React from 'react';
import { useKaiaWallet } from '../contexts/WalletProvider';

// Helper function untuk memotong alamat dompet agar lebih pendek
const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

function WalletConnectButton() {
    // Mengambil state dan fungsi dari context dompet kita
    const { address, connectWallet, disconnectWallet, error } = useKaiaWallet();

    return (
        <div className="wallet-connector">
            {address ? (
                // Tampilan jika dompet sudah terhubung
                <div className="wallet-connected">
                    <span className="wallet-address">{formatAddress(address)}</span>
                    <button onClick={disconnectWallet} className="wallet-button disconnect">
                        Putuskan
                    </button>
                </div>
            ) : (
                // Tampilan jika dompet belum terhubung
                <button onClick={connectWallet} className="wallet-button connect">
                    Hubungkan Dompet
                </button>
            )}
            
            {/* Menampilkan pesan error jika ada */}
            {error && <p className="wallet-error">{error}</p>}
        </div>
    );
}

export default WalletConnectButton;