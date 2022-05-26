//
//
//

import { Bitfruit } from "./types/Bitfruit.ts";
import { Collection } from "../mongo/Collection.ts";

export class BitfruitRepo {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/dayfruits.json";
  // 取得
  async loadFruit(fruitId: number, yyyyMMdd: string): Promise<Bitfruit> {
    const c = new Collection<Bitfruit>("dayfruits");
    const fruit = await c.findOne({
      "fruit_id": fruitId,
      "yyyymmdd": yyyyMMdd,
    });
    return fruit;
  }
  // 日付を指定して取得
  async loadFruitsByDate(yyyyMMdd: string): Promise<Bitfruit[]> {
    const c = new Collection<Bitfruit>("dayfruits");
    const fruits = await c.find({
      "yyyymmdd": yyyyMMdd,
    });
    return fruits;
  }
  // 作成/更新
  async updateFruit(fruit: Bitfruit): Promise<void> {
    const c = new Collection<Bitfruit>("dayfruits");
    console.log(
      `will update fruit id: ${fruit.fruit_id} yyyymmdd: ${fruit.yyyymmdd}`,
    );
    await c.replaceOne(
      { "fruit_id": fruit.fruit_id, "yyyymmdd": fruit.yyyymmdd },
      fruit,
    );
  }

  // 作成/更新
  async saveFruits(fruits: Bitfruit[]): Promise<void> {
    const c = new Collection<Bitfruit>("dayfruits");
    await c.insertMany(fruits);
  }
}
