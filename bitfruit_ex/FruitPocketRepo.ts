//
//
//

// utils
import { MongoCollection } from "../utils/mod.ts";

// in-mod
import { FruitPocket } from "./types/FruitPocket.ts";

/// FruitPocketRepo
export class FruitPocketRepo {
  collection = new MongoCollection<FruitPocket>("fruitpockets");
  // 取得
  async loadPockets(addr: string): Promise<FruitPocket[]> {
    const pockets = await this.collection.find({ "owner_addr": addr });
    return pockets;
  }
  // 所有数をインクリメント(upsert 0基準)
  async incCount(addr: string, fruitId: number, diff: number) {
    await this.collection.increment(
      {
        "owner_addr": addr,
        "fruit_id": fruitId,
      },
      "count",
      diff,
    );
  }
}
