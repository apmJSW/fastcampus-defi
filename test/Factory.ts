import { ethers } from "hardhat"
import { expect } from "chai";

import { Exchange } from "../typechain-types/contracts/Exchange"
import { Token } from "../typechain-types/contracts/Token";
import { Factory } from "../typechain-types/contracts/Factory";

import { BigNumber } from "ethers";

const toWei = (value: number) => ethers.utils.parseEther(value.toString());
const toEther = (value: BigNumber) => ethers.utils.formatEther(value);
const getBalance = ethers.provider.getBalance;

describe("Factory", () => {
    let owner: any;
    let user: any;
    let factory: Factory;
    let token: Token;

    beforeEach(async () => {

        //기본적으로 10,000개의 Ether를 가지고 있음.
        [owner, user] = await ethers.getSigners();
        const TokenFactory = await ethers.getContractFactory("Token");
        token = await TokenFactory.deploy("GrayToken", "GRAY", toWei(50));
        await token.deployed();

        const FactoryFactory = await ethers.getContractFactory("Factory");
        factory = await FactoryFactory.deploy();
        await factory.deployed();
    });

    describe("deploy Factory Contract", async () => {
        it("correct deploy factory", async () => {
            // callStatic으로 호출하면 view로 함수 호출. 결과만 사용하고 내부적으로 실행된 값들 저장x. 가스비 안 듦.
            const exchangeAddress = await factory.callStatic.createExchange(token.address);
            console.log(exchangeAddress);
            console.log(await factory.getExchange(token.address));  
            // 000000000000000 <- callStatic으로 최초에 호출했기 때문에 컨트랙트에 값이 저장되지 않았음            await factory.createExchange(token.address);
            expect(await factory.getExchange(token.address)).eq(exchangeAddress);
        });
    });

})