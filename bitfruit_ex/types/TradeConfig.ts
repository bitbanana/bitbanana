// 変動を決定するための内部設定値
export type TradeConfig = {
  // ID
  fruit_id: number;
  // 最低価格
  min_price: number;
  // 最高価格
  max_price: number;
  // 最初期の価格
  origin_price: number;
  // 1つの取引で変動する価格
  trade_rate_price: number;
};
