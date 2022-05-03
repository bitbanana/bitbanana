import { DayFruit } from "./types/DayFruit.ts";

export function defaultDayFruits(yyyymmdd: string): DayFruit[] {
  return [
    {
      fruit_id: 0,
      yyyymmdd: yyyymmdd,
      buy_count: 0,
      sell_count: 0,
      price_ytd: 120,
      price: 120,
    },
  ];
}
