//
//
//

// in-mod
import { TxListener } from "../interfaces/TxListener.ts";
import { Stake } from "./Stake.ts";
import { Tx } from "./Tx.ts";

/// State
export type State = {
  // 処理待ちのTx
  whiteTxList: Tx[];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[];
  // Txの処理を監視しているリスナー
  txListeners: TxListener[];
};
