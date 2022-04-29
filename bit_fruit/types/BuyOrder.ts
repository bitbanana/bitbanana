// 購入注文書
export type BuyOrder = {
  // 購入者のアドレス
  addr: string;
  // 購入するビットフルーツのID
  fruit_id: number;
  // 個数
  count: number;
};
