import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { KomorebiNoSekai } from "../src/types/KomorebiNoSekai";

declare module "mocha" {
  export interface Context {
    komorebiNoSekai: KomorebiNoSekai;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  anyone: SignerWithAddress;
}
