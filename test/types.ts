import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";

import type { MockableTimeKomorebiNoSekai } from "../src/types/MockableTimeKomorebiNoSekai";
import type { KomorebiFlipper } from "../src/types/KomorebiFlipper";

declare module "mocha" {
  export interface Context {
    komorebiNoSekai: MockableTimeKomorebiNoSekai;
    komorebiFlipper: KomorebiFlipper;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  anyone: SignerWithAddress;
  whitelistedUser: SignerWithAddress;
}
