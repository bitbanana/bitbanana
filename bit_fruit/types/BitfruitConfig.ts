// 固定された内部設定値
export type BitfruitConfig = {
  // ID
  bitfruit_id: number;
  // 最低価格
  min_price: number;
  // 最高価格
  max_price: number;
  // スタート時の価格
  start_price: number;
  // 1つ買われたときの 上昇価格
  upConf: number;
  // 1つ売却されたときの 下降価格
  downConf: number;
};
