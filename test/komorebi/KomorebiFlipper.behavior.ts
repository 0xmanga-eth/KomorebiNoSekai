import { expect } from "chai";
import { ethers } from "hardhat";

export function shouldBehaveLikeKomorebiFlipper(): void {
  it("flips", async function () {
    await this.komorebiNoSekai.connect(this.signers.admin).devMint(10);
    await this.komorebiFlipper.connect(this.signers.admin).addInPool([0]);
    //await this.komorebiFlipper.connect(this.signers.anyone).play(0, false);
  });
}
