//
//
//

// blockchain
import { Block } from "../blockchain/mod.ts";

export class KeyPairRepository {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./ico/mock_db_key_pair.json";
  async loadKeyPair(): Promise<string> {
    // ファイルのテキストを読み込む
    const text = await Deno.readTextFile(this.filePath);
    return text;
  }
  async saveKeyPair(keyPair: string) {
    const text = keyPair;
    // create: ファイルが存在しない場合は作成 = false
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    // 今回は 存在する場合のみ 上書き
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}
