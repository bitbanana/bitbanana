//
//
//

// in-mod
import { Block } from "../types/Block.ts";
import { getBlockHash } from "./getBlockHash.ts";

// ブロックが有効かどうか確認する
export async function blockIsValid(b: Block, prevB: Block): Promise<boolean> {
  // ハッシュが偽造されていないことを確認
  const copyB = b;
  copyB.hash = "";
  const copyBHash = await getBlockHash(copyB); // 計算した値
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
