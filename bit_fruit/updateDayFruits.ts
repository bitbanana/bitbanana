import { DayFruit } from "./types/DayFruit.ts";
import { Collection } from "../mongo/Collection.ts";
import { DayFruitRepo } from "./DayFruitRepo.ts";
import { yyyyMMdd } from "../utils/date_format.ts";
import { dayFruitConfigs } from "./dayFruitConfigs.ts";

// 6時間ごとに実行される
export async function updateDayFruits() {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  // 通信
  const c = new Collection<DayFruit>("dayfruits");
  const fruits = await c.find({ "yyyymmdd": todayYyyymmdd });

  const updatedFruits: DayFruit[] = [];
  for await (const f of fruits) {
    const conf = dayFruitConfigs.find((e) => e.fruit_id === f.fruit_id);
    if (conf === undefined) {
      throw new Error("フルーツ設定値が見つかりませんでした");
    }
    const diff = (f.buy_count - f.sell_count) * conf.trade_rate_price;
    const newPrice = f.price_ytd + parseInt(Math.trunc(diff).toFixed()); //小数点切り捨て

    const todayF: DayFruit = {
      fruit_id: f.fruit_id,
      yyyymmdd: f.yyyymmdd,
      buy_count: f.buy_count,
      sell_count: f.sell_count,
      price_ytd: f.price,
      price: newPrice,
    };
    updatedFruits.push(todayF);
  }

  for await (const uF of updatedFruits) {
    // 通信
    await c.replaceOne(
      { "fruit_id": uF.fruit_id, "yyyymmdd": uF.yyyymmdd },
      uF,
    );
  }
}
