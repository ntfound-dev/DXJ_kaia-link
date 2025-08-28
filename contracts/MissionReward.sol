// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MissionReward is Ownable {
    IERC20 public immutable rewardToken; // Alamat kontrak USDT Kaia
    address public signerAddress; // Alamat backend yang berhak memberikan "tiket"

    // Mapping nonce untuk setiap pengguna untuk mencegah replay attack
    mapping(address => uint256) public userNonce;

    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _rewardTokenAddress, address _initialSigner) {
        rewardToken = IERC20(_rewardTokenAddress);
        signerAddress = _initialSigner;
    }

    /// @dev Fungsi utama yang dipanggil pengguna untuk mengklaim hadiah.
    /// @param amount Jumlah hadiah yang akan diklaim.
    /// @param nonce Nonce unik untuk transaksi ini.
    /// @param signature Tanda tangan digital dari backend.
    function claimReward(uint256 amount, uint256 nonce, bytes calldata signature) public {
        require(nonce == userNonce[msg.sender], "Invalid nonce");
        
        // Verifikasi bahwa signature sah dan berasal dari signerAddress
        address recoveredSigner = _verify(amount, nonce, signature);
        require(recoveredSigner == signerAddress, "Invalid signature");

        userNonce[msg.sender]++; // Tingkatkan nonce agar signature ini tidak bisa dipakai lagi
        
        rewardToken.transfer(msg.sender, amount);
        emit RewardClaimed(msg.sender, amount);
    }

    /// @dev Fungsi internal untuk memverifikasi tanda tangan.
    function _verify(uint256 amount, uint256 nonce, bytes memory signature) internal view returns (address) {
        // Membuat hash dari data yang sama persis dengan yang dibuat di backend
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, amount, nonce, address(this)));
        // Mengembalikan alamat yang menandatangani hash ini
        return ECDSA.recover(ECDSA.toEthSignedMessageHash(messageHash), signature);
    }
    
    /// @dev Mengubah alamat signer jika suatu saat kunci backend bocor.
    function setSigner(address newSigner) public onlyOwner {
        signerAddress = newSigner;
    }
}