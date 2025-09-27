// debugDataCoin.js - Debug version with detailed logging
const { ethers } = require("hardhat");
require('dotenv').config();

async function main() {
    console.log("🐛 DEBUG: Starting DataCoin creation script...");
    console.log("=" .repeat(60));
    
    try {
        // Check environment variables
        console.log("🔍 Checking environment variables...");
        
        if (!process.env.PRIVATE_KEY) {
            console.error("❌ ERROR: PRIVATE_KEY not found in .env file");
            return;
        }
        
        if (!process.env.SEPOLIA_RPC_URL) {
            console.error("❌ ERROR: SEPOLIA_RPC_URL not found in .env file");
            return;
        }
        
        console.log("✅ Private key found:", process.env.PRIVATE_KEY.substring(0, 10) + "...");
        console.log("✅ RPC URL found:", process.env.SEPOLIA_RPC_URL);
        
        // Test network connection
        console.log("\n🌐 Testing network connection...");
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        
        try {
            const network = await provider.getNetwork();
            console.log("✅ Network connected:", network.name, "Chain ID:", network.chainId.toString());
            
            if (network.chainId.toString() !== "11155111") {
                console.warn("⚠️  WARNING: Expected Sepolia (11155111), got:", network.chainId.toString());
            }
        } catch (networkError) {
            console.error("❌ Network connection failed:", networkError.message);
            return;
        }
        
        // Test wallet
        console.log("\n👤 Testing wallet connection...");
        let wallet;
        try {
            wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
            console.log("✅ Wallet created successfully");
            console.log("📍 Wallet address:", wallet.address);
        } catch (walletError) {
            console.error("❌ Wallet creation failed:", walletError.message);
            console.log("💡 Make sure your private key starts with '0x' and is 66 characters long");
            return;
        }
        
        // Check balances
        console.log("\n💰 Checking balances...");
        
        try {
            const ethBalance = await provider.getBalance(wallet.address);
            console.log("⛽ ETH Balance:", ethers.formatEther(ethBalance), "ETH");
            
            if (ethBalance < ethers.parseEther("0.001")) {
                console.warn("⚠️  WARNING: Low ETH balance, might not cover gas fees");
            }
        } catch (balanceError) {
            console.error("❌ Failed to check ETH balance:", balanceError.message);
        }
        
        // Check USDC balance
        const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
        const USDC_ABI = [
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)",
            "function symbol() view returns (string)"
        ];
        
        try {
            const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, wallet);
            const [usdcBalance, decimals, symbol] = await Promise.all([
                usdcContract.balanceOf(wallet.address),
                usdcContract.decimals(),
                usdcContract.symbol()
            ]);
            
            console.log(`💵 ${symbol} Balance:`, ethers.formatUnits(usdcBalance, decimals));
            
            const minRequired = ethers.parseUnits("5", decimals);
            if (usdcBalance < minRequired) {
                console.error(`❌ ERROR: Insufficient ${symbol}. Need at least 5 ${symbol}`);
                console.log("💡 Get more USDC from a Sepolia faucet or DEX");
                return;
            } else {
                console.log("✅ Sufficient USDC for DataCoin creation");
            }
            
        } catch (usdcError) {
            console.error("❌ Failed to check USDC balance:", usdcError.message);
            console.log("💡 This might indicate network issues or wrong contract address");
        }
        
        // Test contract interaction capability
        console.log("\n🔧 Testing contract interaction...");
        
        try {
            const latestBlock = await provider.getBlockNumber();
            console.log("✅ Latest block number:", latestBlock);
            
            const gasPrice = await provider.getFeeData();
            console.log("⛽ Current gas price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");
            
        } catch (contractError) {
            console.error("❌ Contract interaction test failed:", contractError.message);
        }
        
        console.log("\n" + "=" .repeat(60));
        console.log("🎯 DIAGNOSIS COMPLETE");
        console.log("=" .repeat(60));
        
        console.log("\n💡 If everything above shows ✅, try running the original script again:");
        console.log("node scripts/createDataCoin.js");
        
        console.log("\n🔧 If the original script still hangs, check:");
        console.log("1. Make sure scripts/createDataCoin.js exists");
        console.log("2. Check if there are any console.log or error messages");
        console.log("3. Verify the script has proper error handling");
        console.log("4. Try running with more verbose logging: DEBUG=* node scripts/createDataCoin.js");
        
    } catch (error) {
        console.error("💥 CRITICAL ERROR:", error.message);
        console.error("Stack trace:", error.stack);
    }
}

// Run with timeout to prevent hanging
const TIMEOUT = 30000; // 30 seconds

Promise.race([
    main(),
    new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Script timeout after 30 seconds")), TIMEOUT)
    )
]).then(() => {
    console.log("🏁 Debug script completed successfully");
    process.exit(0);
}).catch((error) => {
    if (error.message.includes("timeout")) {
        console.error("⏰ TIMEOUT: Script took too long to complete");
        console.log("💡 This suggests network connectivity issues or slow RPC response");
    } else {
        console.error("❌ Debug script failed:", error.message);
    }
    process.exit(1);
});