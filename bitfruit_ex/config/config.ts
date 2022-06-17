//
//
//

import { TradeConfig } from "../types/TradeConfig.ts";

export const startBonusAmount = 5000;
export const bitfruitExAddr = "@bitfruitex";
export const bitfruitExTmpSig = "@bitfruitex.tmp.sig";
export const tradeConfigs: TradeConfig[] = [
  {
    fruit_id: 0, // メロン
    min_price: 100,
    max_price: 200,
    origin_price: 150,
    trade_rate_price: 0.4,
  },
  {
    fruit_id: 1, // グレープ
    min_price: 80,
    max_price: 220,
    origin_price: 150,
    trade_rate_price: 0.2,
  },
  {
    fruit_id: 2, // チェリー
    min_price: 120,
    max_price: 180,
    origin_price: 150,
    trade_rate_price: 0.6,
  },
];
