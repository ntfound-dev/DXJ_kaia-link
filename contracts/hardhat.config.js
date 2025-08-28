require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Memuat variabel dari file .env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // Pastikan versi ini sama dengan yang di kontrak Anda
  networks: {
    // Jaringan development lokal Hardhat
    hardhat: {},
    // Jaringan Testnet Kaia (Baobab)
    baobab: {
      url: process.env.BAOBAB_RPC_URL || "https://public-en-baobab.klaytn.net",
      chainId: 1001,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY], // Kunci rahasia diambil dari .env
      gasPrice: 250000000000,
    },
    // Jaringan Mainnet Kaia (Cypress) - HATI-HATI JANGAN SAMPAI SALAH DEPLOY
    cypress: {
      url: process.env.CYPRESS_RPC_URL || "https://public-en-cypress.klaytn.net",
      chainId: 8217,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY], // Kunci yang sama atau berbeda, tergantung strategi Anda
      gasPrice: 250000000000,
    },
  },
  // (Opsional) Untuk verifikasi kontrak otomatis di Klaytnscope
  etherscan: {
    apiKey: {
      klaytn: process.env.KLAYTNSCOPE_API_KEY,
      klaytn_baobab: process.env.KLAYTNSCOPE_API_KEY,
    },
    customChains: [
      {
        network: "klaytn_baobab",
        chainId: 1001,
        urls: {
          apiURL: "https://api-baobab.klaytnscope.com/api",
          browserURL: "https://baobab.klaytnscope.com",
        },
      },
      {
        network: "klaytn",
        chainId: 8217,
        urls: {
          apiURL: "https://api.klaytnscope.com/api",
          browserURL: "https://klaytnscope.com",
        },
      },
    ],
  },
};