// 売却注文書
export type SellOrder = {
  // 売却者のアドレス
  addr: string;
  // 売却するビットフルーツのID
  bitfruit_id: number;
  // 個数
  count: number;
};
