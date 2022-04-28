//
//
//

import { Bitfruit } from "./types/BitFruit.ts";

export class BitfruitRepository {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/Bitfruits.json";
  // 取得
  async loadBitfruits(): Promise<Bitfruit[]> {
    const text = await Deno.readTextFile(this.filePath);
    const bitfruits: Bitfruit[] = JSON.parse(text);
    return bitfruits;
  }
  // 作成/更新
  async updateBitfruits(bitfruits: Bitfruit[]): Promise<void> {
    const text = JSON.stringify(bitfruits, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}
