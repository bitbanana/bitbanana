import { DayFruitConfig } from "./types/DayFruitConfig.ts";

export const dayFruitConfigs: DayFruitConfig[] = [
  {
    fruit_id: 0, // メロン
    min_price: 100,
    max_price: 200,
    origin_price: 150,
    up_conf: 0.4,
    down_conf: 0.4,
  },
  {
    fruit_id: 1, // グレープ
    min_price: 80,
    max_price: 220,
    origin_price: 150,
    up_conf: 0.2,
    down_conf: 0.2,
  },
  {
    fruit_id: 2, // チェリー
    min_price: 120,
    max_price: 180,
    origin_price: 150,
    up_conf: 0.6,
    down_conf: 0.6,
  },
];
