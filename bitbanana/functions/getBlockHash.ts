//
//
//

// utils
import * as hash from "../../utils/mod.ts";

// in-mod
import { Block } from "../types/Block.ts";

// ブロックのハッシュを計算する
export async function getBlockHash(
  b: Block,
): Promise<string> {
  b.hash = "";
  const str = JSON.stringify(b);
  return await hash.sha256(str);
}
