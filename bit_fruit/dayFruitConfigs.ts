import { DayFruitConfig } from "./types/DayFruitConfig.ts";

export const dayFruitConfigs: DayFruitConfig[] = [
  {
    // ID
    fruit_id: 0,
    // 最低価格
    min_price: 120,
    // 最高価格
    max_price: 180,
    // 最初期の価格
    origin_price: 130,
    // 1つ買われたときの 上昇価格
    up_conf: 0.2,
    // 1つ売却されたときの 下降価格
    down_conf: 0.2,
  },
];
