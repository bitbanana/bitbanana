// blockchain
import { Block, calcBlockHash } from "../blockchain/mod.ts";
import { BlockchainRepository } from "./BlockchainRepository.ts";
import { BitbananaWalletRepository } from "./BitbananaWalletRepository.ts";
import { BitbananaWallet } from "./types/BitBananaWallet.ts";
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

const wallet: BitbananaWallet = {
  addr: addr,
  pvtKey: pvtKey,
  pubKey: pubKey,
};

const r = new BitbananaWalletRepository();
await r.saveWallet(wallet);

// deno run --allow-read --allow-write bit_banana/tmp_wallet_gen.ts
