//
//
//

// utils
import { MongoCollection } from "../utils/mod.ts";

// in-mod
import { Bitfruit } from "./types/Bitfruit.ts";

/// BitfruitRepo
export class BitfruitRepo {
  // 取得
  async loadFruit(fruitId: number, yyyyMMdd: string): Promise<Bitfruit> {
    const c = new MongoCollection<Bitfruit>("bitfruits");
    const fruit = await c.findOne({
      "fruit_id": fruitId,
      "yyyymmdd": yyyyMMdd,
    });
    return fruit;
  }

  // 取得
  async getBitfruits(fruit_id?: number): Promise<Bitfruit[]> {
    const c = new MongoCollection<Bitfruit>("bitfruits");
    let filter = {}; // All Fruits
    console.log(`fid exists? ${fruit_id !== undefined}`);
    if (fruit_id !== undefined) {
      filter = { "fruit_id": fruit_id };
    }
    const fruits = await c.find(filter);
    return fruits;
  }

  // 日付を指定して取得
  async loadFruitsByDate(yyyyMMdd: string): Promise<Bitfruit[]> {
    const c = new MongoCollection<Bitfruit>("bitfruits");
    const fruits = await c.find({
      "yyyymmdd": yyyyMMdd,
    });
    return fruits;
  }

  // 売却された数を集計
  async incSellCount(
    fruitId: number,
    yyyymmdd: string,
    diff: number,
  ): Promise<void> {
    const c = new MongoCollection<Bitfruit>("bitfruits");
    await c.increment(
      { "fruit_id": fruitId, "yyyymmdd": yyyymmdd },
      "sell_count",
      diff,
    );
  }

  // 購入された数を集計
  async incBuyCount(
    fruitId: number,
    yyyymmdd: string,
    diff: number,
  ): Promise<void> {
    const c = new MongoCollection<Bitfruit>("bitfruits");
    await c.increment(
      { "fruit_id": fruitId, "yyyymmdd": yyyymmdd },
      "buy_count",
      diff,
    );
  }

  // 保存
  async saveFruits(fruits: Bitfruit[]): Promise<void> {
    const c = new MongoCollection<Bitfruit>("bitfruits");
    await c.insertMany(fruits);
  }

  // 複数を更新
  async updateMany(fruits: Bitfruit[]): Promise<void> {
    const c = new MongoCollection<Bitfruit>("bitfruits");
    for await (const f of fruits) {
      await c.replaceOne(
        { "fruit_id": f.fruit_id, "yyyymmdd": f.yyyymmdd },
        f,
      );
    }
  }
}
