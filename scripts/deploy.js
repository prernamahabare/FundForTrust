const hre = require("hardhat");

async function main() {
    const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
    const crowdfunding = await CrowdFunding.deploy();
    await crowdfunding.waitForDeployment(); // Changed from deployed() to waitForDeployment()
    console.log("CrowdFunding deployed to:", await crowdfunding.getAddress()); // Changed from crowdfunding.address
}

// CrowdFunding deployed to: 0x5c1B2A0F3b94BF1D87953B9B364ad2A051F2081e


// Successfully submitted source code for contract
// contracts/CrowdFunding.sol:CrowdFunding at 0x5c1B2A0F3b94BF1D87953B9B364ad2A051F2081e
// for verification on the block explorer. Waiting for verification result...

// Successfully verified contract CrowdFunding on the block explorer.
// https://sepolia.etherscan.io/address/0x5c1B2A0F3b94BF1D87953B9B364ad2A051F2081e#code

main().catch((error) => {
    console.error(error);
    process.exit(1);
});