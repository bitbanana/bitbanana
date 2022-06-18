//
//
//

// blockchain
import { Stake, Tx, TxListener } from "../../blockchain/mod.ts";

/// IFullNode
export interface IFullNode {
  // 残高照会 (全レコード参照)
  balanceInquiry(addr: string): Promise<number>;
  // 処理待ちの Tx を追加する
  // (WebSocket クライアント > サーバー)
  addWhiteTx(tx: Tx): Promise<void>;
  // Txの変化通知を受ける
  addTxListener(listener: TxListener): Promise<void>;
  // くじ引きに応募する
  addStake(stake: Stake): void;
}
