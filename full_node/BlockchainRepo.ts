//
//
//

// blockchain
import { Block } from "../blockchain/mod.ts";

// mongo
import { Collection } from "../mongo/Collection.ts";

/// BlockchainRepo
export class BlockchainRepo {
  // ブロックを保存
  async saveBlock(block: Block): Promise<void> {
    const c = new Collection<Block>("blockchain");
    await c.insertOne(block);
  }

  // 最後のブロックを取得
  async getLastBlock(): Promise<Block> {
    const c = new Collection<Block>("blockchain");
    const lastBlock = await c.findCustom({}, { _id: -1 }, 1);
    if (lastBlock.length !== 1) {
      throw new Error("最後のブロッック取得に失敗しました");
    }
    return lastBlock[0];
  }

  // このインデックスを含まない
  async findAfterIndex(index: number): Promise<Block[]> {
    const c = new Collection<Block>("blockchain");
    // index が引数のindexより大きいもののみ
    // index が小さい順にソート=1
    const blocks = await c.findCustom({ "index": { "$gt": index } }, {
      "index": 1,
    });
    return blocks;
  }
}
