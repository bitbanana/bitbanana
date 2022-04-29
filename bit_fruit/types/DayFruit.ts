// 価格変動中のフルーツ情報
export type DayFruit = {
  // ビットフルーツ ID
  fruit_id: number;
  // 日付
  yyyymmdd: string;
  // 買われた数
  buy_count: number;
  // 売られた数
  sell_count: number;
  // 昨日の価格
  price_ytd: number;
  // 現在の価格
  price: number;
};
