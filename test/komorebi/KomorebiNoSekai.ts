import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { MockableTimeKomorebiNoSekai } from "../../src/types/MockableTimeKomorebiNoSekai";

import { Signers } from "../types";
import { shouldBehaveLikeBountyFactory } from "./KomorebiNoSekai.behavior";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.anyone = signers[1];
  });

  describe("KomorebiNoSekai", function () {
    beforeEach(async function () {
      const komorebiNoSekaiArtifact: Artifact = await artifacts.readArtifact("MockableTimeKomorebiNoSekai");

      const maxBatchSize = 10;
      const collectionSize = 8888;
      const amountForDevs = 50;

      this.komorebiNoSekai = <MockableTimeKomorebiNoSekai>(
        await waffle.deployContract(this.signers.admin, komorebiNoSekaiArtifact, [
          maxBatchSize,
          collectionSize,
          amountForDevs,
        ])
      );
    });

    shouldBehaveLikeBountyFactory();
  });
});
