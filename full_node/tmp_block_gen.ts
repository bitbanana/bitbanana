// blockchain
import { Block, calcBlockHash } from "../blockchain/mod.ts";
import { BlockchainRepo } from "./BlockchainRepo.ts";

const block: Block = {
  index: 0,
  time: "2022-01-01T00:00:00.000Z",
  tx_id: "",
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

console.log(JSON.stringify(block));

const r = new BlockchainRepo();
await r.saveBlock(block);

console.log("完了");
// deno run --allow-read --allow-write full_node/tmp_block_gen.ts
