import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account: ", deployer.address);

  const Factory = await ethers.getContractFactory("Factory");
  const contract = await Factory.deploy();

  const GrayToken = await ethers.getContractFactory("Token");
  const grayTokenContract = await GrayToken.deploy("GrayToken", "GRAY", 1000);

  console.log("FactoryContract deployed at: ", contract.address );
  console.log("GrayTokenContract deployed at: ", grayTokenContract.address );

  const Exchange = await ethers.getContractFactory("Exchange");
  const exchageContract = await Exchange.deploy(grayTokenContract.address);
  
  console.log("ExchangeContract deployed at: ", exchageContract.address );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
