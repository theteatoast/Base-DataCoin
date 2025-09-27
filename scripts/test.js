// simpleTest.js - Basic test to see if environment is working
console.log("🧪 Simple Environment Test");
console.log("=" .repeat(40));

console.log("Node.js version:", process.version);
console.log("Current directory:", process.cwd());

try {
    require('dotenv').config();
    console.log("✅ dotenv loaded successfully");
    
    // Check if .env exists and has content
    if (process.env.PRIVATE_KEY) {
        console.log("✅ PRIVATE_KEY found in environment");
    } else {
        console.log("❌ PRIVATE_KEY not found in environment");
    }
    
    if (process.env.SEPOLIA_RPC_URL) {
        console.log("✅ SEPOLIA_RPC_URL found in environment");
    } else {
        console.log("❌ SEPOLIA_RPC_URL not found in environment");
    }
    
} catch (error) {
    console.log("❌ Error loading environment:", error.message);
}

try {
    const { ethers } = require("hardhat");
    console.log("✅ Hardhat and ethers loaded successfully");
    console.log("Ethers version:", ethers.version);
} catch (error) {
    console.log("❌ Error loading hardhat/ethers:", error.message);
}

console.log("\n🎯 Environment test complete!");
console.log("If you see ✅ for all items above, the environment is ready.");
console.log("If you see ❌, fix those issues before running DataCoin script.");