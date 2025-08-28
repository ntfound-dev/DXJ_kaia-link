// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface sederhana untuk kontrak Strategi
interface IStrategy {
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external;
    function totalAssets() external view returns (uint256);
    function harvest() external returns (uint256 profit);
}

// Vault ini adalah pintu masuk pengguna, dibangun di atas standar ERC4626
contract SmartVault is ERC4626, Ownable {
    IStrategy public strategy;
    uint256 public performanceFeeBps; // Biaya performa dalam basis points (e.g., 1000 = 10%)

    // Fungsi deposit dan withdraw sudah disediakan oleh ERC4626

    constructor(
        IERC20 _asset, // Token yang akan diinvestasikan (USDT)
        string memory _name,
        string memory _symbol
    ) ERC4626(_asset) ERC20(_name, _symbol) {}

    /// @dev Menghitung total aset = aset di vault ini + aset yang sedang bekerja di strategi
    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this)) + strategy.totalAssets();
    }
    
    /// @dev Fungsi untuk memanen profit dari strategi. Bisa dipanggil siapa saja.
    function harvest() public {
        uint256 profit = strategy.harvest();
        if (profit > 0) {
            uint256 fee = (profit * performanceFeeBps) / 10000;
            asset.transfer(owner(), fee); // Kirim fee ke dompet proyek
        }
    }

    /// @dev Mengubah atau mengatur kontrak strategi. Hanya bisa dilakukan oleh admin.
    function setStrategy(address newStrategy) public onlyOwner {
        // Logika untuk memindahkan semua dana dari strategi lama ke strategi baru dengan aman
        strategy = IStrategy(newStrategy);
    }

    /// @dev Mengatur biaya performa.
    function setPerformanceFee(uint256 feeBps) public onlyOwner {
        require(feeBps <= 2000, "Fee too high"); // Maksimal 20%
        performanceFeeBps = feeBps;
    }
}