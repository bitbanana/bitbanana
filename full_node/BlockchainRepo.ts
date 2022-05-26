//
//
//

// blockchain
import { Block } from "../blockchain/mod.ts";
import { Collection } from "../mongo/Collection.ts";

export class BlockchainRepo {
  async saveBlock(block: Block): Promise<void> {
    const c = new Collection<Block>("blockchain");
    await c.insertOne(block);
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
