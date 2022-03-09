import { expect } from "chai";
import { ethers } from "hardhat";
const collectionName = "Komorebi No Sekai";
const collectionSymbol = "KNS";

export function shouldBehaveLikeBountyFactory(): void {
  it("end to end", async function () {
    // check data after deploy
    expect(await this.komorebiNoSekai.name()).to.be.equal(collectionName);
    expect(await this.komorebiNoSekai.symbol()).to.be.equal(collectionSymbol);
    expect(await this.komorebiNoSekai.totalSupply()).to.be.equal(0);

    // anyone cannot dev mint
    await expect(this.komorebiNoSekai.connect(this.signers.anyone).devMint(10)).to.be.revertedWith(
      "Ownable: caller is not the owner",
    );

    // owner can mint for devs, mint 10 NFTs for devs
    await this.komorebiNoSekai.connect(this.signers.admin).devMint(10);
    expect(await this.komorebiNoSekai.totalSupply()).to.be.equal(10);

    // mock time
    let currentTime = 1622551248;
    await this.komorebiNoSekai.connect(this.signers.admin).setCurrentTime(currentTime);
    let publicSaleTime = currentTime + 1000;

    // set public sale start time and price\
    const publicMintPrice = ethers.utils.parseEther("0.1");
    await this.komorebiNoSekai.connect(this.signers.admin).setSaleStartTime(publicSaleTime);
    await this.komorebiNoSekai.connect(this.signers.admin).setPrice(publicMintPrice);

    // cannot mint before public sale is open
    await expect(this.komorebiNoSekai.connect(this.signers.anyone).saleMint(1)).to.be.revertedWith(
      "public sale has not begun yet",
    );

    currentTime = publicSaleTime + 100;
    await this.komorebiNoSekai.connect(this.signers.admin).setCurrentTime(currentTime);

    await expect(
      this.komorebiNoSekai.connect(this.signers.anyone).saleMint(1, { value: ethers.utils.parseEther("0.095") }),
    ).to.be.revertedWith("Need to send more ETH.");

    // can mint when public sale is open
    await expect(this.komorebiNoSekai.connect(this.signers.anyone).saleMint(1, { value: publicMintPrice }))
      .to.emit(this.komorebiNoSekai, "Transfer")
      .withArgs("0x0000000000000000000000000000000000000000", this.signers.anyone.address, 10);

    expect(await this.komorebiNoSekai.balanceOf(this.signers.anyone.address)).to.be.equal(1);
  });
}
