import {
  createSigningKeyPair,
  pubKey2str,
  pvtKey2str,
} from "../utils/signing_key_pair.ts";

import { BitbananaWallet } from "./types/BitBananaWallet.ts";

import { calcAddress } from "../blockchain/functions/calc_address.ts";

export async function createWallet(): Promise<BitbananaWallet> {
  const pair = await createSigningKeyPair();
  const pubKey = await pubKey2str(pair.publicKey);
  const pvtKey = await pvtKey2str(pair.privateKey);
  const addr = await calcAddress(pubKey);
  const wallet: BitbananaWallet = {
    addr: addr,
    pvtKey: pvtKey,
    pubKey: pubKey,
  };
  return wallet;
}
