const { expect } = require("chai");
const hre = require("hardhat");

describe("KaiaLinkProfile Contract", function () {
  let KaiaLinkProfile, kaiaLinkProfile;
  let owner, backend, user1, user2;

  // Blok ini dijalankan sebelum setiap tes ('it')
  beforeEach(async function () {
    // Ambil beberapa akun untuk disimulasikan
    [owner, backend, user1, user2] = await hre.ethers.getSigners();

    // Deploy kontrak baru untuk setiap tes agar tidak saling mempengaruhi
    KaiaLinkProfile = await hre.ethers.getContractFactory("KaiaLinkProfile");
    kaiaLinkProfile = await KaiaLinkProfile.deploy();
    await kaiaLinkProfile.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Harus memberikan DEFAULT_ADMIN_ROLE kepada deployer (owner)", async function () {
      const ADMIN_ROLE = await kaiaLinkProfile.DEFAULT_ADMIN_ROLE();
      expect(await kaiaLinkProfile.hasRole(ADMIN_ROLE, owner.address)).to.equal(true);
    });
  });

  describe("Manajemen Role", function () {
    it("Owner (admin) harus bisa memberikan UPDATER_ROLE ke akun backend", async function () {
      const UPDATER_ROLE = await kaiaLinkProfile.UPDATER_ROLE();
      await kaiaLinkProfile.connect(owner).grantRole(UPDATER_ROLE, backend.address);
      expect(await kaiaLinkProfile.hasRole(UPDATER_ROLE, backend.address)).to.equal(true);
    });
  });

  describe("Fungsi Inti", function () {
    // Berikan role ke backend sebelum menjalankan tes di grup ini
    beforeEach(async function () {
      const UPDATER_ROLE = await kaiaLinkProfile.UPDATER_ROLE();
      await kaiaLinkProfile.connect(owner).grantRole(UPDATER_ROLE, backend.address);
    });

    it("Admin harus bisa me-mint profil baru untuk user1", async function () {
      await expect(kaiaLinkProfile.connect(owner).mintProfile(user1.address, false))
        .to.not.be.reverted;
      const tokenId = await kaiaLinkProfile.userToTokenId(user1.address);
      expect(tokenId).to.equal(1);
    });

    it("Akun non-admin TIDAK BOLEH bisa me-mint profil", async function () {
      // Kita mengharapkan transaksi ini gagal (reverted)
      await expect(kaiaLinkProfile.connect(user1).mintProfile(user2.address, false))
        .to.be.reverted;
    });

    it("Akun backend (dengan UPDATER_ROLE) harus bisa mengupdate reputasi", async function () {
      // Mint dulu profil untuk user1
      await kaiaLinkProfile.connect(owner).mintProfile(user1.address, false);

      await expect(kaiaLinkProfile.connect(backend).updateReputation(user1.address, 100, 500, 2))
        .to.not.be.reverted;

      const profile = await kaiaLinkProfile.getProfile(user1.address);
      expect(profile.reputationScore).to.equal(500);
      expect(profile.level).to.equal(2);
    });

    it("Akun tanpa UPDATER_ROLE TIDAK BOLEH bisa mengupdate reputasi", async function () {
      await kaiaLinkProfile.connect(owner).mintProfile(user1.address, false);

      await expect(kaiaLinkProfile.connect(user1).updateReputation(user1.address, 100, 500, 2))
        .to.be.reverted;
    });
  });
});