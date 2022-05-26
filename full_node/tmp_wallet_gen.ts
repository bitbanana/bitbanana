// blockchain
import { BitbananaWalletRepo } from "./BitbananaWalletRepo.ts";
import { BitbananaWallet } from "./types/BitbananaWallet.ts";
import {
  createSigningKeyPair,
  pubKey2str,
  pvtKey2str,
} from "../utils/signing_key_pair.ts";
import { calcAddress } from "../blockchain/functions/calc_address.ts";
import { VERSION } from "../full_node/config.ts";

const keyPair = await createSigningKeyPair();
const pubKey = await pubKey2str(keyPair.publicKey);
const addr = await calcAddress(pubKey);
const now = new Date().toISOString();
const wallet: BitbananaWallet = {
  addr: addr,
  jwk: "",
  balance_memo: 0,
  nickname: "",
  created_at: now,
  version: VERSION,
};

const r = new BitbananaWalletRepo();
await r.saveWallet(wallet);

// deno run --allow-read --allow-write bit_banana/tmp_wallet_gen.ts
