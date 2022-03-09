import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { KomorebiNoSekai } from "../../src/types/KomorebiNoSekai";

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
      const komorebiNoSekaiArtifact: Artifact = await artifacts.readArtifact("KomorebiNoSekai");
      this.komorebiNoSekai = <KomorebiNoSekai>await waffle.deployContract(this.signers.admin, komorebiNoSekaiArtifact, []);
    });

    shouldBehaveLikeBountyFactory();
  });
});
