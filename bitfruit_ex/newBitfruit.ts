import { Bitfruit } from "./types/Bitfruit.ts";
import { TradeConfig } from "./types/TradeConfig.ts";

/// 新規で作成するDayFruit
export function newBitfruit(
  config: TradeConfig,
  yyyymmdd: string,
): Bitfruit {
  return {
    fruit_id: config.fruit_id,
    yyyymmdd: yyyymmdd,
    buy_count: 0,
    sell_count: 0,
    price_ytd: config.origin_price,
    price: config.origin_price,
  };
}
