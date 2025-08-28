import axios from 'axios';

const THE_GRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/kaia-defi-protocol/vaults';
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

export default class BlockchainService {

    /**
     * @dev Mengambil data semua vault dari The Graph, bukan dari node langsung.
     * @returns {Promise<Array<object>>} Array objek vault dengan data APY, TVL, dll.
     */
    static async getOnChainVaultData() {
        const query = `{
            vaults(first: 50) {
                id, address, apy, tvl, riskScore
            }
        }`;
        const response = await axios.post(THE_GRAPH_ENDPOINT, { query });
        return response.data.data.vaults;
    }

    /**
     * @dev Mengambil aktivitas on-chain seorang pengguna dari Moralis.
     * @param {string} userAddress
     * @returns {Promise<object>} Objek yang berisi ringkasan aktivitas pengguna.
     */
    static async getOnChainUserActivity(userAddress) {
        const url = `https://deep-index.moralis.io/api/v2.2/${userAddress}/verbose`;
        const response = await axios.get(url, { headers: { 'X-API-Key': MORALIS_API_KEY } });
        // Lakukan perhitungan degenScore, txPerWeek, dll. dari data response.
        return { degenScore: 0.7, txPerWeek: 15, /* ... */ };
    }
}