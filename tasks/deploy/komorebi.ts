import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KomorebiNoSekai } from "../../src/types/KomorebiNoSekai";

import { KomorebiNoSekai__factory } from "../../src/types/factories/KomorebiNoSekai__factory";

task("deploy:Bounties").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const KomorebiNoSekaiFactory: KomorebiNoSekai__factory = <KomorebiNoSekai__factory>(
    await ethers.getContractFactory("KomorebiNoSekai")
  );

  const maxBatchSize = 10;
  const collectionSize = 8888;
  const amountForDevs = 50;
  const komorebiNoSekai: KomorebiNoSekai = <KomorebiNoSekai>(
    await KomorebiNoSekaiFactory.deploy(maxBatchSize, collectionSize, amountForDevs)
  );
  await komorebiNoSekai.deployed();
  console.log("KomorebiNoSekai deployed to: ", komorebiNoSekai.address);

  await sleep(60000);

  console.log("publishing source code to Etherscan");

  const hre = require("hardhat");
  await hre.run("verify:verify", {
    address: komorebiNoSekai.address,
    constructorArguments: [maxBatchSize, collectionSize, amountForDevs],
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
