export function shouldBehaveLikeKomorebiFlipper(): void {
  it("flips", async function () {
    await this.komorebiNoSekai.connect(this.signers.admin).devMint(10);
    await this.komorebiNoSekai.connect(this.signers.admin).setApprovalForAll(this.komorebiFlipper.address, true);
    await this.komorebiFlipper.connect(this.signers.admin).addInPool([0, 1, 2, 3, 4]);
  });
}
