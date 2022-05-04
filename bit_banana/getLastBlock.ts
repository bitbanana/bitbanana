import { Block } from "../blockchain/types/block.ts";
import { Collection } from "../mongo/Collection.ts";

export async function getLastBlock(): Promise<Block> {
  const c = new Collection<Block>("blockchain");
  const lastBlock = await c.findCustom({}, { _id: -1 }, 1);
  if (lastBlock.length !== 1) {
    throw new Error("最後のブロッック取得の検索結果に異常が見つかりました");
  }
  return lastBlock[0];
}
