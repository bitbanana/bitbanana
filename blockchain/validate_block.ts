//
//
//

// utils
import * as date_format from "../utils/date_format.ts";
import * as base58 from "../utils/base58.ts";
import * as hash from "../utils/hash.ts";

// types
import { Block } from "./types/block.ts";

// func
import { calcBlockHash } from "./calc_block_hash.ts";

// ブロックのハッシュを計算する
export async function correctHashOfBlock(
  b: Block,
): Promise<string> {
  // 順番は必ず守ること
  const hexHash = await calcBlockHash(
    b.index,
    b.time,
    b.prev_hash,
    b.tx,
    b.validator,
  );
  return hexHash;
}

// ブロックが有効かどうか確認する
export async function validateBlock(b: Block, prevB: Block): Promise<boolean> {
  // ハッシュが偽造されていないことを確認
  const bHash = await correctHashOfBlock(b); // 計算した値
  if (b.hash != bHash) {
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
