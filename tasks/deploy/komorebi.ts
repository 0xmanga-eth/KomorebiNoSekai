import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KomorebiNoSekai } from "../../src/types/KomorebiNoSekai";

import { KomorebiNoSekai__factory } from "../../src/types/factories/KomorebiNoSekai__factory";

task("deploy:Bounties").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const KomorebiNoSekaiFactory: KomorebiNoSekai__factory = <KomorebiNoSekai__factory>await ethers.getContractFactory("KomorebiNoSekai");
  const komorebiNoSekai: KomorebiNoSekai = <KomorebiNoSekai>await KomorebiNoSekaiFactory.deploy();
  await komorebiNoSekai.deployed();
  console.log("KomorebiNoSekai deployed to: ", komorebiNoSekai.address);
});
