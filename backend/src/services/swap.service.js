import { KaiaLinkPairABI } from '../abi';
import { ethers } from 'ethers';
import ReputationService from './reputation.service.js';

export default class SwapService {
    /**
     * @dev Menghitung estimasi output swap dengan membaca data dari pair contract.
     */
    static async getSwapQuote(tokenIn, tokenOut, amountIn) {
        // 1. Dapatkan alamat pair contract dari Factory contract
        // 2. Baca `getReserves()` dari Pair contract
        // 3. Hitung jumlah output berdasarkan rumus AMM
        // 4. Return estimasi
    }

    /**
     * @dev Menentukan tingkatan fee pengguna berdasarkan skor reputasi.
     */
    static async getUserFeeTier(walletAddress) {
        const profile = await ReputationService.getUserProfileFromDB(walletAddress);
        if (profile.reputationScore > 5000) return { tier: 3, discount: "33%" };
        if (profile.reputationScore > 1000) return { tier: 2, discount: "15%" };
        return { tier: 1, discount: "0%" };
    }
}