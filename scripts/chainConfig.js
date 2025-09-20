require("dotenv").config();

const validChainNames = ["sepolia", "base"];

const RPC_URLs = {
  base: process.env.BASE_RPC_URL || "",
  sepolia: process.env.SEPOLIA_RPC_URL || "",
};

const FactoryAddresses = {
  base: "0x0000000000000000000000000000000000000000",
  sepolia: "0x35Be51DBC05C0630E77b1D4ee76B7DE612975E2A",
};

const approvedLockAssets = {
  base: {
    USDC: {
      address: "",
      decimal: "",
      minLockAmount: "",
      buyTaxBPS: "",
      sellTaxBPS: "",
      mintTaxBPS: "",
    },
    WETH: {
      address: "",
      decimal: "",
      minLockAmount: "",
      buyTaxBPS: "",
      sellTaxBPS: "",
      mintTaxBPS: "",
    },
    LSDC: {
      address: "",
      decimal: "",
      minLockAmount: "",
      buyTaxBPS: "",
      sellTaxBPS: "",
      mintTaxBPS: "",
    },
  },
  sepolia: {
    USDC: {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimal: 6,
      minLockAmount: 5000000,
      buyTaxBPS: 100,
      sellTaxBPS: 100,
      mintTaxBPS: "50",
    },
    WETH: {
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
      decimal: 18,
      minLockAmount: 100000000000000,
      buyTaxBPS: 100,
      sellTaxBPS: 100,
      mintTaxBPS: 50,
    },
    LSDC: {
      address: "0xB3296A9Fe9c9e5752f446d745EE7F47F77E13720",
      decimal: 18,
      minLockAmount: 10000000000000000000000,
      buyTaxBPS: 100,
      sellTaxBPS: 100,
      mintTaxBPS: 50,
    },
  },
};

const getChainConfig = (chainName) => {
  if (!validChainNames.includes(chainName)) {
    throw new Error(`${chainName} Not Supported!!`);
  }
  return {
    rpc: RPC_URLs[chainName],
    factoryAddress: FactoryAddresses[chainName],
  };
};

const getAssetConfig = (chainName, assetName) => {
  if (!validChainNames.includes(chainName)) {
    throw new Error(`${chainName} Not Supported!!`);
  }
  return approvedLockAssets[chainName][assetName];
};

module.exports = {
  getChainConfig,
  getAssetConfig,
};
