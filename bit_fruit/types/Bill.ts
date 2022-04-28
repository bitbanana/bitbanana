// 請求書
export type Bill = {
  // ID
  id: string;
  // 支払い用の Tx ID
  tx_id: string;
  // 送金者のアドレス
  s_addr: string;
  // 振込先のアドレス
  r_addr: string;
  // 作成日時
  created_at: string;
  // 金額
  amount: number;
};
