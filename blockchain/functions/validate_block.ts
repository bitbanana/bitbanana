//
//
//

// types
import { Block } from "../types/block.ts";

// func
import { calcBlockHash } from "./calc_block_hash.ts";

// ブロックが有効かどうか確認する
export async function validateBlock(b: Block, prevB: Block): Promise<boolean> {
  // ハッシュが偽造されていないことを確認
  const copyB = b;
  copyB.hash = "";
  const copyBHash = await calcBlockHash(copyB); // 計算した値
  if (b.hash != copyBHash) {
    return false;
  }
  // 連続したブロックであることを確認
  const bIndex = prevB.index + 1; // 計算した値
  if (b.index != bIndex) {
    return false;
  }
  // ハッシュが引き継がれているかを確認
  const prevBHash = b.prev_hash; // 計算した値
  if (prevB.hash != prevBHash) {
    return false;
  }
  return true;
}
