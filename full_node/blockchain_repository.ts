//
//
//

// blockchain
import { Block } from "../blockchain/mod.ts";

export class BlockchainRepository {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./full_node/db/blockchain.json";
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
}
