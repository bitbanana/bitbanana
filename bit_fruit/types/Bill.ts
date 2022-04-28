// 請求書
export type Bill = {
  // ID
  id: string;
  // 支払い用の Tx ID
  tx_id: string;
  // 作成日時
  created_at: string;
};
