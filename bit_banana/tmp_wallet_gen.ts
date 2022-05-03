// blockchain
import { Block, calcBlockHash } from "../blockchain/mod.ts";
import { BlockchainRepository } from "./BlockchainRepository.ts";
import { BitbananaWalletRepository } from "./BitbananaWalletRepository.ts";
import { BitbananaWallet } from "./types/BitbananaWallet.ts";
import {
  createSigningKeyPair,
  pubKey2str,
  pvtKey2str,
} from "../utils/signing_key_pair.ts";
import { calcAddress } from "../blockchain/functions/calc_address.ts";

const keyPair = await createSigningKeyPair();
const pubKey = await pubKey2str(keyPair.publicKey);
const pvtKey = await pvtKey2str(keyPair.privateKey);
const addr = await calcAddress(pubKey);
const now = new Date().toISOString();
const wallet: BitbananaWallet = {
  addr: addr,
  jwk: "",
  balance_memo: 0,
  nickname: "",
  created_at: now,
  version: "0.0.1",
};

const r = new BitbananaWalletRepository();
await r.saveWallet(wallet);

// deno run --allow-read --allow-write bit_banana/tmp_wallet_gen.ts
