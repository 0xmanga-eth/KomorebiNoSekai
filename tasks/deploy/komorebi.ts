import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KomorebiNoSekai } from "../../src/types/KomorebiNoSekai";

import { KomorebiNoSekai__factory } from "../../src/types/factories/KomorebiNoSekai__factory";

task("deploy:KomorebiNoSekai").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const KomorebiNoSekaiFactory: KomorebiNoSekai__factory = <KomorebiNoSekai__factory>(
    await ethers.getContractFactory("KomorebiNoSekai")
  );

  const maxBatchSize = 10;
  const collectionSize = 8888;
  const amountForDevs = 50;
  const vrfCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952";
  const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
  const vrfKeyHash = "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445";
  const vrfFee = "2000000000000000000"; // 2 LINK

  const komorebiNoSekai: KomorebiNoSekai = <KomorebiNoSekai>(
    await KomorebiNoSekaiFactory.deploy(
      maxBatchSize,
      collectionSize,
      amountForDevs,
      vrfCoordinator,
      linkToken,
      vrfKeyHash,
      vrfFee,
    )
  );
  await komorebiNoSekai.deployed();
  console.log("KomorebiNoSekai deployed to: ", komorebiNoSekai.address);

  await sleep(60000);

  console.log("publishing source code to Etherscan");

  const hre = require("hardhat");
  await hre.run("verify:verify", {
    address: komorebiNoSekai.address,
    constructorArguments: [maxBatchSize, collectionSize, amountForDevs, vrfCoordinator, linkToken, vrfKeyHash, vrfFee],
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
