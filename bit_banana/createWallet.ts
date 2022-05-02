import {
  createSigningKeyPair,
  pubKey2str,
  pvtKey2str,
} from "../utils/signing_key_pair.ts";

import { BitbananaWallet } from "./types/BitbananaWallet.ts";

import { calcAddress } from "../blockchain/functions/calc_address.ts";

export async function createWallet(): Promise<BitbananaWallet> {
  const pair = await createSigningKeyPair();
  const pubKey = await pubKey2str(pair.publicKey);
  const addr = await calcAddress(pubKey);
  const now = new Date().toISOString();
  const wallet: BitbananaWallet = {
    addr: addr,
    jwk: "",
    balance_memo: 0,
    nickname: "BitBananaServerWallet",
    created_at: now,
    version: "0.0.1",
  };
  return wallet;
}
