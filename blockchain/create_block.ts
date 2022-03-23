//
//
//

// func
import { calcBlockHash } from "./calc_block_hash.ts";

// types
import { Block } from "./types/block.ts";
import { Tx } from "./types/tx.ts";
import { Validator } from "./types/validator.ts";

// 新しいブロックを生成
export async function createBlock(
  prevB: Block,
  tx: Tx,
  validator: Validator,
): Promise<Block> {
  const time = new Date().toISOString();
  const index = prevB.index + 1;
  const hash = await calcBlockHash(
    index,
    time,
    prevB.hash,
    tx,
    validator,
  );

  // 仮のハッシュ値でブロックを生成
  const block: Block = {
    index: index,
    time: time,
    tx: tx,
    hash: hash,
    prev_hash: prevB.hash,
    validator: validator,
  };
  // 正しいハッシュを計算

  return block;
}
