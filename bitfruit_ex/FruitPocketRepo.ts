//
//
//

import { FruitPocket } from "./types/FruitPocket.ts";
import { Collection } from "../mongo/Collection.ts";

export class FruitPocketRepo {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/fruitpockets.json";
  // 取得
  async loadPockets(addr: string): Promise<FruitPocket[]> {
    const c = new Collection<FruitPocket>("fruitpockets");
    const pockets = await c.find({ "owner_addr": addr });
    return pockets;
  }
  // 上書き保存
  async savePocket(pocket: FruitPocket): Promise<void> {
    const c = new Collection<FruitPocket>("fruitpockets");
    await c.replaceOne({
      "owner_addr": pocket.owner_addr,
      "fruit_id": pocket.fruit_id,
    }, pocket);
  }
}
