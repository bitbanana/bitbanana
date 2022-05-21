import { DayFruit } from "./types/DayFruit.ts";
import { dayFruitConfigs } from "./dayFruitConfigs.ts";

export function defaultDayFruits(yyyymmdd: string): DayFruit[] {
  return dayFruitConfigs.map((e) => {
    return {
      fruit_id: e.fruit_id, // メロン
      yyyymmdd: yyyymmdd,
      buy_count: 0,
      sell_count: 0,
      price_ytd: (e.min_price + e.max_price) / 2.0,
      price: (e.min_price + e.max_price) / 2.0,
    };
  });
}
