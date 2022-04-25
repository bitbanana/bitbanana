import { Tx } from "../blockchain/mod.ts";
import { bitFruit, whiteTxList } from "./full_node.ts";

// 初回限定ボーナスをもらう
export async function startBonus(addr: string) {
  await bitFruit.wallet.initialize();
  const tx = await bitFruit.createStartBonusTx(addr);
  addWhiteTx(tx);
}

// 残高照会
export function balanceInquiry() {
}

// 処理待ちの Tx を追加する
// (WebSocket クライアント > サーバー)
export function addWhiteTx(tx: Tx) {
  whiteTxList.push(tx);
}
