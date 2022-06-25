//
//
//

// utils
import { MongoCollection } from "../../utils/mod.ts";

// bitbanana
import { Block, IBlockchainRepo } from "../../bitbanana/mod.ts";

// in-mod
import { genesisBlock } from "./config.ts";

/// BlockchainRepo
export class BlockchainRepo implements IBlockchainRepo {
  collection = new MongoCollection<Block>("blockchain");
  // ジェネシスブロック
  getGenesisBlock(): Block {
    return genesisBlock;
  }

  // ブロックを保存
  async saveBlock(block: Block): Promise<void> {
    await this.collection.insertOne(block);
  }

  // 最後のブロックを取得
  async getLastBlock(): Promise<Block> {
    const lastBlock = await this.collection.findCustom({}, { _id: -1 }, 1);
    if (lastBlock.length !== 1) {
      throw new Error("最後のブロッック取得に失敗しました");
    }
    return lastBlock[0];
  }

  // このインデックスを含まない && index が小さい順にソート
  async findAfterIndex(index: number): Promise<Block[]> {
    // index が引数のindexより大きいもののみ
    // index が小さい順にソート=1
    const blocks = await this.collection.findCustom({
      "index": { "$gt": index },
    }, {
      "index": 1,
    });
    return blocks;
  }
}
