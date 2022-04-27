// blockchain
import { Block, calcBlockHash } from "../blockchain/mod.ts";
import { BlockchainRepository } from "./BlockchainRepository.ts";

const block: Block = {
  index: 0,
  time: "1995-01-01T00:00:00.000Z",
  tx_id: "",
  tx_page: 0,
  tx_all_pages: 0,
  s_addr: "",
  s_sig: "",
  r_addr: "",
  amount: 0,
  fee: 0,
  v_addr: "",
  v_token: 0,
  v_sig: "",
  prev_hash: "",
  hash: "",
};

const hash = await calcBlockHash(block);
block.hash = hash;

const r = new BlockchainRepository();
r.saveLocalBlockchain([block]);

// deno run --allow-read --allow-write bit_banana/tmp_block_gen.ts
