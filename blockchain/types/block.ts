//
//
//

import { Tx } from "./tx.ts";
import { Validator } from "./validator.ts";

// 1つのブロック
export type Block = {
  // 何番目のブロックか
  index: number;
  // ブロックが作成されたときのタイムスタンプ
  time: string;
  // 前のブロックのハッシュ値
  prev_hash: string;
  // このブロックのハッシュ値
  hash: string;
  // トランザクション
  tx: Tx;
  // ブロックの正しさを証明するバリデーター
  validator: Validator;
};
