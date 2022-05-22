import { DayFruit } from "./types/DayFruit.ts";
import { DayFruitConfig } from "./types/DayFruitConfig.ts";

/// 新規で作成するDayFruit
export function newDayFruit(
  config: DayFruitConfig,
  yyyymmdd: string,
): DayFruit {
  return {
    fruit_id: config.fruit_id,
    yyyymmdd: yyyymmdd,
    buy_count: 0,
    sell_count: 0,
    price_ytd: config.origin_price,
    price: config.origin_price,
  };
}
