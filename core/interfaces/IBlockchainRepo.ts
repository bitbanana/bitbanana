//
//
//

// in-mod
import { Block } from "../types/Block.ts";

/// IBlockchainRepo
export interface IBlockchainRepo {
  // ジェネシスブロック
  getGenesisBlock(): Block;

  // ブロックを保存
  saveBlock(block: Block): Promise<void>;

  // 最後のブロックを取得
  getLastBlock(): Promise<Block>;

  // このインデックスを含まない && index が小さい順にソート
  findAfterIndex(index: number): Promise<Block[]>;
}
