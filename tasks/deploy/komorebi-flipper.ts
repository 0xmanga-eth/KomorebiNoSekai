import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { KomorebiFlipper } from "../../src/types/KomorebiFlipper";

import { KomorebiFlipper__factory } from "../../src/types/factories/KomorebiFlipper__factory";

task("deploy:KomorebiFlipper").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const komorebiFlipperFactory: KomorebiFlipper__factory = <KomorebiFlipper__factory>(
    await ethers.getContractFactory("KomorebiFlipper")
  );

  const knsAddress = "0x675CDdAc819D41C37331644047508822D764aBed";
  const vrfCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952";
  const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
  const vrfKeyHash = "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445";
  const vrfFee = "2000000000000000000"; // 2 LINK

  const komorebiFlipper: KomorebiFlipper = <KomorebiFlipper>(
    await komorebiFlipperFactory.deploy(knsAddress, vrfCoordinator, linkToken, vrfKeyHash, vrfFee)
  );
  await komorebiFlipper.deployed();
  console.log("KomorebiFlipper deployed to: ", komorebiFlipper.address);

  await sleep(60000);

  console.log("publishing source code to Etherscan");

  const hre = require("hardhat");
  await hre.run("verify:verify", {
    address: komorebiFlipper.address,
    constructorArguments: [knsAddress, vrfCoordinator, linkToken, vrfKeyHash, vrfFee],
  });
});

task("deploy:KomorebiFlipper:Rinkeby").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const komorebiFlipperFactory: KomorebiFlipper__factory = <KomorebiFlipper__factory>(
    await ethers.getContractFactory("KomorebiFlipper")
  );

  const knsAddress = "0x675CDdAc819D41C37331644047508822D764aBed";
  const vrfCoordinator = "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B";
  const linkToken = "0x01BE23585060835E02B77ef475b0Cc51aA1e0709";
  const vrfKeyHash = "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311";
  const vrfFee = "100000000000000000"; // 0.1 LINK

  const komorebiFlipper: KomorebiFlipper = <KomorebiFlipper>(
    await komorebiFlipperFactory.deploy(knsAddress, vrfCoordinator, linkToken, vrfKeyHash, vrfFee)
  );
  await komorebiFlipper.deployed();
  console.log("KomorebiFlipper deployed to: ", komorebiFlipper.address);

  await sleep(60000);

  console.log("publishing source code to Etherscan");

  const hre = require("hardhat");
  await hre.run("verify:verify", {
    address: komorebiFlipper.address,
    constructorArguments: [knsAddress, vrfCoordinator, linkToken, vrfKeyHash, vrfFee],
  });
});

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
