const hre = require("hardhat");

async function main() {
  console.log("Memulai proses deployment...");
  
  // Ambil akun yang akan mendeploy
  const [deployer] = await hre.ethers.getSigners();
  console.log("Mendeploy kontrak dengan akun:", deployer.address);

  // --- Alamat & Konfigurasi Penting ---
  const USDT_TOKEN_ADDRESS = process.env.USDT_TOKEN_ADDRESS; // Alamat USDT di jaringan target
  const BACKEND_SIGNER_ADDRESS = process.env.BACKEND_SIGNER_ADDRESS; // Alamat backend untuk MissionReward & KaiaLinkProfile

  if (!USDT_TOKEN_ADDRESS || !BACKEND_SIGNER_ADDRESS) {
    throw new Error("Harap definisikan USDT_TOKEN_ADDRESS dan BACKEND_SIGNER_ADDRESS di file .env");
  }

  // 1. Deploy KaiaLinkProfile.sol
  console.log("Mendeploy KaiaLinkProfile...");
  const KaiaLinkProfile = await hre.ethers.getContractFactory("KaiaLinkProfile");
  const kaiaLinkProfile = await KaiaLinkProfile.deploy();
  await kaiaLinkProfile.waitForDeployment();
  const kaiaLinkProfileAddress = await kaiaLinkProfile.getAddress();
  console.log(`✅ KaiaLinkProfile dideploy ke alamat: ${kaiaLinkProfileAddress}`);

  // 2. Deploy MissionReward.sol
  console.log("Mendeploy MissionReward...");
  const MissionReward = await hre.ethers.getContractFactory("MissionReward");
  const missionReward = await MissionReward.deploy(USDT_TOKEN_ADDRESS, BACKEND_SIGNER_ADDRESS);
  await missionReward.waitForDeployment();
  const missionRewardAddress = await missionReward.getAddress();
  console.log(`✅ MissionReward dideploy ke alamat: ${missionRewardAddress}`);

  // 3. Deploy SmartVault.sol
  console.log("Mendeploy SmartVault...");
  const SmartVault = await hre.ethers.getContractFactory("SmartVault");
  const smartVault = await SmartVault.deploy(USDT_TOKEN_ADDRESS, "KaiaLink USDT Vault", "klUSDT");
  await smartVault.waitForDeployment();
  const smartVaultAddress = await smartVault.getAddress();
  console.log(`✅ SmartVault dideploy ke alamat: ${smartVaultAddress}`);

  // --- Konfigurasi Pasca-Deployment ---
  console.log("Memulai konfigurasi pasca-deployment...");
  // Berikan UPDATER_ROLE kepada backend di kontrak KaiaLinkProfile
  const UPDATER_ROLE = await kaiaLinkProfile.UPDATER_ROLE();
  const tx = await kaiaLinkProfile.grantRole(UPDATER_ROLE, BACKEND_SIGNER_ADDRESS);
  await tx.wait();
  console.log(`✅ UPDATER_ROLE diberikan kepada ${BACKEND_SIGNER_ADDRESS} di KaiaLinkProfile.`);

  console.log("\n🚀 Deployment Selesai! 🚀");
  console.log("-----------------------------------------");
  console.log("KaiaLinkProfile:", kaiaLinkProfileAddress);
  console.log("MissionReward:", missionRewardAddress);
  console.log("SmartVault:", smartVaultAddress);
  console.log("-----------------------------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});