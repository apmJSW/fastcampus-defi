import "@nomiclabs/hardhat-waffle";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      gas: 10000000,
      gasPrice: 875000000
    },
    goerli: {
      url: process.env.ALL_THAT_NODE_API_KEY,
      accounts: [process.env.METAMASK_PRIVATE_KEY as string]
    }
  }, etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
