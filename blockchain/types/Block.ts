//
//
//

export type Block = {
  // 何番目のブロックか
  index: number;
  // ブロックが作成されたときのタイムスタンプ
  time: string;
  // トランザクション ID
  tx_id: string;
  // 送信者のアドレス
  s_addr: string;
  // 送信者の署名
  s_sig: string;
  // 受信者のアドレス
  r_addr: string;
  // 送信量
  amount: number;
  // 手数料 送信量とは別 ブロックごとに独立
  fee: number;
  // バリデーターのアドレス
  v_addr: string;
  // バリデーターのトークン
  v_token: number;
  // バリデーターの署名
  v_sig: string;
  // 前のブロックのハッシュ値
  prev_hash: string;
  // このブロックのハッシュ値
  hash: string;
};

const block: Block = {
  index: 0,
  time: "1995-01-01T00:00:00.000Z",
  tx_id: "",
  s_addr: "",
  s_sig: "",
  r_addr: "",
  amount: 0,
  fee: 0,
  v_addr: "",
  v_token: 0,
  v_sig: "",
  prev_hash: "",
  hash: "",
};
