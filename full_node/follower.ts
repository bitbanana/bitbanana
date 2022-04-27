//
//
//

import { SenderSigContent } from "../blockchain/mod.ts";
export interface Follower {
  // txが拒否されたとき
  // (WebSocket サーバー > クライアント)
  onRedTx(contents: SenderSigContent[]): void;

  // txがブロックとしてチェーンに追加されたとき
  // (WebSocket サーバー > クライアント)
  onGreenTx(content: SenderSigContent[]): void;
}
