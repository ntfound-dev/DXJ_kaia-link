// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./KaiaLinkProfile.sol";
import "./IPriceOracle.sol"; // Interface untuk oracle harga

contract LendingPool {
    KaiaLinkProfile public immutable kaiaLinkProfile;
    IPriceOracle public immutable priceOracle;
    
    // ... mapping untuk menyimpan data simpanan dan pinjaman pengguna ...

    /// @dev Menyetor aset (misal: USDT) untuk mendapatkan bunga.
    function supply(address asset, uint256 amount) external {
        // ... Logika untuk mentransfer aset dari pengguna dan mint kToken sebagai gantinya ...
    }

    /// @dev Meminjam aset dengan menjaminkan aset lain. INI LOGIKA KOMPLEKSNYA.
    function borrow(address asset, uint256 amount) external {
        // 1. Hitung total nilai jaminan (collateral) pengguna dalam USD menggunakan priceOracle
        uint256 collateralValueUSD = _calculateUserCollateralValue(msg.sender);
        
        // 2. Ambil skor reputasi pengguna dari KaiaLinkProfile
        KaiaLinkProfile.Profile memory profile = kaiaLinkProfile.getProfile(msg.sender);
        uint256 reputationScore = profile.reputationScore;

        // 3. Hitung "nilai reputasi" sebagai agunan virtual
        uint256 reputationValueUSD = reputationScore * 10; // Misal: 1 skor = $10 nilai virtual

        // 4. Hitung total kekuatan pinjaman (borrowing power)
        uint256 maxBorrowPowerUSD = (collateralValueUSD + reputationValueUSD) * LTV_RATIO; // LTV_RATIO misal 80%

        // 5. Pastikan total pinjaman baru + lama tidak melebihi batas
        require(_calculateUserTotalBorrowValue(msg.sender) + (amountInUSD) <= maxBorrowPowerUSD, "Insufficient collateral or reputation");

        // 6. Jika valid, transfer aset yang dipinjam ke pengguna
        // ...
    }
    
    /// @dev Fungsi untuk likuidasi pinjaman yang "tidak sehat".
    function liquidationCall(...) external {
        // ...
    }
}