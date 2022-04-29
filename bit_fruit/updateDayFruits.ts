import { DayFruit } from "./types/DayFruit.ts";

// 6時間ごとに実行される
export function updateDayFruits(): DayFruit[] {
  const dammy: DayFruit = {
    fruit_id: 0,
    yyyymmdd: "20220101",
    buy_count: 5,
    sell_count: 5,
    price_ytd: 110,
    price: 120,
  };
  return [dammy];
}
