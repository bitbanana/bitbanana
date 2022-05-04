//
//
//

// blockchain
import { Block } from "../blockchain/mod.ts";
import { Collection } from "../mongo/Collection.ts";

export class BlockchainRepo {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_banana/db/blockchain.json";
  // async saveLocalBlockchain(allBlocks: Block[]) {
  //   // Block型の配列をテキストへ変換する
  //   const text = JSON.stringify(allBlocks, null, 2);
  //   // create: ファイルが存在しない場合は作成 = false
  //   // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
  //   // 今回は 存在する場合のみ 上書き
  //   const opt = { append: false, create: false };
  //   await Deno.writeTextFile(this.filePath, text, opt);
  // }
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
    // ファイルのテキストを読み込む
    // const text = await Deno.readTextFile(this.filePath);
    // Block型の配列へ変換する
    // let allBlocks: Block[] = JSON.parse(text);
    // chain = chain.filter((e) => e.index > index);
    // return chain;
  }
}
