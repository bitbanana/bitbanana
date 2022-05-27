//
//
//

import { Tx } from "../blockchain/types/Tx.ts";
export interface Follower {
  // txが拒否されたとき
  // (WebSocket サーバー > クライアント)
  onRedTx(tx: Tx): void;

  // txがブロックとしてチェーンに追加されたとき
  // (WebSocket サーバー > クライアント)
  onGreenTx(tx: Tx): void;
}
