// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract KaiaLinkProfile is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Definisikan role untuk backend yang boleh update
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    struct Profile {
        uint256 reputationScore; // Skor utama
        uint256 experiencePoints; // XP untuk gamifikasi
        uint256 level;            // Level pengguna
        uint256 createdAt;        // Timestamp pembuatan profil
        bool isVerified;          // Status verifikasi (untuk masa depan)
    }

    mapping(address => uint256) public userToTokenId;
    mapping(uint256 => Profile) public profiles;

    constructor() ERC721("KaiaLink Profile", "KLP") {
        // Berikan role default kepada alamat yang mendeploy kontrak
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
    }

    /// @dev Mint profil baru. Hanya bisa dipanggil oleh admin.
    function mintProfile(address user, bool initialVerificationStatus) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(userToTokenId[user] == 0, "User already has a profile");
        // ... logika minting NFT dan inisialisasi Profile struct
    }

    /// @dev Update reputasi. Hanya bisa dipanggil oleh backend dengan UPDATER_ROLE.
    function updateReputation(address user, uint256 newXp, uint256 newScore, uint256 newLevel) public onlyRole(UPDATER_ROLE) {
        require(userToTokenId[user] != 0, "User does not have a profile");
        // ... logika update Profile struct
    }

    /// @dev Fungsi untuk memberikan atau mencabut role updater ke alamat backend baru.
    function setUpdater(address updater, bool isUpdater) public onlyRole(DEFAULT_ADMIN_ROLE) {
        if (isUpdater) {
            _grantRole(UPDATER_ROLE, updater);
        } else {
            _revokeRole(UPDATER_ROLE, updater);
        }
    }
}