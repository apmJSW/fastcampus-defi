import { ethers } from "hardhat"
import { expect } from "chai";

import { Exchange } from "../typechain-types/contracts/Exchange"
import { Token } from "../typechain-types/contracts/Token";
import { BigNumber } from "ethers";

const toWei = (value: number) => ethers.utils.parseEther(value.toString());
const toEther = (value: BigNumber) => ethers.utils.formatEther(value);
const getBalance = ethers.provider.getBalance;

describe("Exchange", () => {
  let owner: any;
  let user: any;
  let exchange: Exchange;
  let token: Token;

  beforeEach(async () => {
    //기본적으로 10,000개의 Ether를 가지고 있음.
    [owner, user] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory("Token");
    token = await TokenFactory.deploy("GrayToken", "GRAY", toWei(50));
    await token.deployed();

    const ExchangeFactory = await ethers.getContractFactory("Exchange");
    exchange = await ExchangeFactory.deploy(token.address);
    await exchange.deployed();
  });

  describe.skip("addLiquidity", async () => {
    it("add liquidity", async () => {
      await token.approve(exchange.address, toWei(5000));
      await exchange.addLiquidity(toWei(500), { value: toWei(1_000) });

      expect(await getBalance(exchange.address)).to.equal(toWei(1_000));
      expect(await token.balanceOf(exchange.address)).to.equal(toWei(500));

      await token.approve(exchange.address, toWei(100));
      await exchange.addLiquidity(toWei(100), { value: toWei(200) });

      expect(await getBalance(exchange.address)).to.equal(toWei(1_200));
      expect(await token.balanceOf(exchange.address)).to.equal(toWei(600));
    });
  });

  describe.skip("removeLiquidity", async () => {
    it("remove liquidity", async () => {
      await token.approve(exchange.address, toWei(5000));
      await exchange.addLiquidity(toWei(500), { value: toWei(1_000) });

      expect(await getBalance(exchange.address)).to.equal(toWei(1_000));
      expect(await token.balanceOf(exchange.address)).to.equal(toWei(500));

      await token.approve(exchange.address, toWei(100));
      await exchange.addLiquidity(toWei(100), { value: toWei(200) });

      expect(await getBalance(exchange.address)).to.equal(toWei(1_200));
      expect(await token.balanceOf(exchange.address)).to.equal(toWei(600));

      await exchange.removeLiquidity(toWei(600));
      expect(await getBalance(exchange.address)).to.equal(toWei(600));
      expect(await token.balanceOf(exchange.address)).to.equal(toWei(300));
    });
  });

  describe.skip("getOutputAmount", async () => {
    it("correct getOutputAmount", async () => {
      await token.approve(exchange.address, toWei(4_000));
      await exchange.addLiquidity(toWei(4_000), { value: toWei(1_000) });

      // console.log(toEther(await exchange.getOutputAmount(toWei(1), getBalance(exchange.address), token.balanceOf(exchange.address))));
    });
  })

  describe.skip("ethToTokenSwap", async () => {
    it("correct ethToTokenSwap", async () => {
      await token.approve(exchange.address, toWei(4_000));
      
      // GRAY:ETH 4:1
      await exchange.addLiquidity(toWei(4_000), { value: toWei(1_000) });

      //1ETH: ?? GRAY
      await exchange.connect(user).ethToTokenSwap(toWei(3.99), {value: toWei(1)});

      console.log(toEther(await token.balanceOf(user.address)));
    });
  })

  describe("swapWithFee", async () => {
    it("correct swapWithFee", async () => {
      await token.approve(exchange.address, toWei(50));

      // 유동성 공급 ETH 50, GRAY 50
      await exchange.addLiquidity(toWei(50), {value: toWei(50)});

      // 유저 ETH 30, GRAY 18.6323713927227 스왑
      await exchange.connect(user).ethToTokenSwap(toWei(18), {value: toWei(30)});

      // 스왑 후 유저의 GRAY 잔액 18.6323713927227
      expect(toEther((await token.balanceOf(user.address))).toString()).to.equal("18.632371392722710163");

      // owner의 유동성 제거 
      await exchange.removeLiquidity(toWei(50));

      // owner의 잔고는 50 - 18.632371392722710163인 31.367628607277289837
      expect(toEther(await token.balanceOf(owner.address)).toString()).to.equal("31.367628607277289837");
    })
  })
})