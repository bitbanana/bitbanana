//
//
//

// blockchain
import { Block } from "../blockchain/mod.ts";

export class BlockchainRepository {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_banana/db/blockchain.json";
  async loadLocalBlockchain(): Promise<Block[]> {
    // ファイルのテキストを読み込む
    const text = await Deno.readTextFile(this.filePath);
    // Block型の配列へ変換する
    const allBlocks: Block[] = JSON.parse(text);
    return allBlocks;
  }
  async saveLocalBlockchain(allBlocks: Block[]) {
    // Block型の配列をテキストへ変換する
    const text = JSON.stringify(allBlocks, null, 2);
    // create: ファイルが存在しない場合は作成 = false
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    // 今回は 存在する場合のみ 上書き
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }

  // このインデックスを含まない
  async findAfterIndex(index: number): Promise<Block[]> {
    let chain = await this.loadLocalBlockchain();
    console.log(`chain 前: ${chain.length}`);
    console.log(`index これ以上で計算します: ${index}`);
    chain = chain.filter((e) => e.index > index);
    console.log(`chain 後: ${chain.length}`);
    return chain;
  }
}
