//
//
//

// mongo
import { Collection } from "../mongo/Collection.ts";

// others
import { FruitPocket } from "./types/FruitPocket.ts";

/// FruitPocketRepo
export class FruitPocketRepo {
  // 取得
  async loadPockets(addr: string): Promise<FruitPocket[]> {
    const c = new Collection<FruitPocket>("fruitpockets");
    const pockets = await c.find({ "owner_addr": addr });
    return pockets;
  }
  // 所有数をインクリメント(upsert 0基準)
  async incCount(addr: string, fruitId: number, diff: number) {
    const c = new Collection<FruitPocket>("fruitpockets");
    await c.increment(
      {
        "owner_addr": addr,
        "fruit_id": fruitId,
      },
      "count",
      diff,
    );
  }
}
