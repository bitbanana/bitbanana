//
//
//

// in-mod
import { Tx } from "../types/Tx.ts";

/// TxListener
export interface TxListener {
  // txが拒否されたとき
  // (WebSocket サーバー > クライアント)
  onRedTx(tx: Tx): void;

  // txがブロックとしてチェーンに追加されたとき
  // (WebSocket サーバー > クライアント)
  onGreenTx(tx: Tx): void;
}
