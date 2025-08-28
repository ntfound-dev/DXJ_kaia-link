import React, { useState, createContext, useContext } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState('0');
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    // Klaytn punya provider khusus 'klaytn', fallback ke 'ethereum' untuk Metamask
    if (window.klaytn || window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.klaytn || window.ethereum);
        const signerInstance = await web3Provider.getSigner();
        const userAddress = await signerInstance.getAddress();
        
        setProvider(web3Provider);
        setSigner(signerInstance);
        setAddress(userAddress);

        // (Opsional) Ambil saldo Kaia
        const kaiaBalance = await web3Provider.getBalance(userAddress);
        setBalance(ethers.formatEther(kaiaBalance));
        setError(null);
      } catch (e) {
        setError("Gagal terhubung dengan dompet.");
        console.error(e);
      }
    } else {
      setError("Dompet Kaia (Kaikas) atau Metamask tidak ditemukan.");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    setProvider(null);
    setBalance('0');
  };

  const value = { address, signer, balance, error, connectWallet, disconnectWallet };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

// Hook kustom untuk memudahkan penggunaan context ini di komponen lain
export const useKaiaWallet = () => useContext(WalletContext);