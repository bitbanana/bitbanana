import { DayFruit } from "./types/DayFruit.ts";
import { Collection } from "../mongo/Collection.ts";
import { DayFruitRepo } from "./DayFruitRepo.ts";
import { yyyyMMdd } from "../utils/date_format.ts";
import { fixedFruits } from "./fixedFruits.ts";
import { dayFruitConfigs } from "./dayFruitConfigs.ts";

// 6時間ごとに実行される
export async function updateDayFruits() {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  console.log(`DayFruits Update ${todayYyyymmdd}`);
  // 通信
  const c = new Collection<DayFruit>("dayfruits");
  const fruits = await c.find({ "yyyymmdd": todayYyyymmdd });
  console.log(`Step 1`);
  const updatedFruits: DayFruit[] = [];
  for await (const f of fruits) {
    const conf = dayFruitConfigs.find((e) => e.fruit_id === f.fruit_id);
    if (conf === undefined) {
      throw new Error("フルーツ設定値が見つかりませんでした");
    }
    const newPrice = f.price_ytd + (conf!.up_conf * f.buy_count) -
      (conf!.down_conf * f.sell_count);
    const todayF: DayFruit = {
      fruit_id: f.fruit_id,
      yyyymmdd: f.yyyymmdd,
      buy_count: f.buy_count,
      sell_count: f.sell_count,
      price_ytd: f.price,
      price: newPrice,
    };

    // 通信
    await c.replaceOne({ "fruit_id": f.fruit_id }, todayF);
    console.log(`Step 2 Fruit ${f.fruit_id}`);
  }

  console.log(`Step Complete`);
}
