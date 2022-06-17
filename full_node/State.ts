import { Stake, Tx } from "../blockchain/mod.ts";
import { TxListener } from "./TxListener.ts";

export class State {
  // 処理待ちのTx
  whiteTxList: Tx[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [];
  // Txの処理を監視しているリスナー
  txListeners: TxListener[] = [];
}
