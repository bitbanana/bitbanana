// 変動を決定するための内部設定値
export type DayFruitConfig = {
  // ID
  fruit_id: number;
  // 最低価格
  min_price: number;
  // 最高価格
  max_price: number;
  // 最初期の価格
  origin_price: number;
  // 1つ買われたときの 上昇価格
  up_conf: number;
  // 1つ売却されたときの 下降価格
  down_conf: number;
};
