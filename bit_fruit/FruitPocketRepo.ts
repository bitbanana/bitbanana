//
//
//

import { FruitPocket } from "./types/FruitPocket.ts";

export class FruitPocketRepo {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/fruitpockets.json";
  // 取得
  async loadPockets(addr: string): Promise<FruitPocket[]> {
    const text = await Deno.readTextFile(this.filePath);
    const pockets: FruitPocket[] = JSON.parse(text);
    const myPockets = pockets.filter((e) => e.owner_addr === addr);
    return myPockets;
  }
  // 上書き保存
  async savePocket(pocket: FruitPocket): Promise<void> {
    let text = await Deno.readTextFile(this.filePath);
    let pockets: FruitPocket[] = JSON.parse(text);
    // 該当のポケットを削除
    pockets = pockets.filter((e) =>
      e.owner_addr !== pocket.owner_addr || e.fruit_id !== pocket.fruit_id
    );
    // 追加
    pockets.push(pocket);
    text = JSON.stringify(pockets, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}
