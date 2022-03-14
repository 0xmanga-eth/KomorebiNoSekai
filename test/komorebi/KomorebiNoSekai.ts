import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { MockableTimeKomorebiNoSekai } from "../../src/types/MockableTimeKomorebiNoSekai";
import type { KomorebiFlipper } from "../../src/types/KomorebiFlipper";

import { Signers } from "../types";
import { shouldBehaveLikeKomorebiNoSekai } from "./KomorebiNoSekai.behavior";
import { shouldBehaveLikeKomorebiFlipper } from "./KomorebiFlipper.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.anyone = signers[1];
    this.signers.whitelistedUser = signers[2];
  });

  describe("KomorebiNoSekai", function () {
    beforeEach(async function () {
      const komorebiNoSekaiArtifact: Artifact = await artifacts.readArtifact("MockableTimeKomorebiNoSekai");

      const maxBatchSize = 10;
      const collectionSize = 8888;
      const amountForDevs = 50;
      const vrfCoordinator = "0xf0d54349aDdcf704F77AE15b96510dEA15cb7952";
      const linkToken = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
      const vrfKeyHash = "0xAA77729D3466CA35AE8D28B3BBAC7CC36A5031EFDC430821C02BC31A238AF445";
      const vrfFee = "2000000000000000000"; // 2 LINK

      this.komorebiNoSekai = <MockableTimeKomorebiNoSekai>(
        await waffle.deployContract(this.signers.admin, komorebiNoSekaiArtifact, [
          maxBatchSize,
          collectionSize,
          amountForDevs,
          vrfCoordinator,
          linkToken,
          vrfKeyHash,
          vrfFee,
        ])
      );

      const komorebiFlipperArtifact: Artifact = await artifacts.readArtifact("KomorebiFlipper");
      this.komorebiFlipper = <KomorebiFlipper>(
        await waffle.deployContract(this.signers.admin, komorebiFlipperArtifact, [
          vrfCoordinator,
          linkToken,
          vrfKeyHash,
          vrfFee,
        ])
      );
    });

    shouldBehaveLikeKomorebiNoSekai();
    shouldBehaveLikeKomorebiFlipper();
  });
});
