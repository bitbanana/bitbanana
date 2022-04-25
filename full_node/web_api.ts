import { Tx } from "../blockchain/mod.ts";
import { bitFruit, FullNode, whiteTxList } from "./full_node.ts";
// utils
import { createSigningKeyPair } from "../utils/signing_key_pair.ts";

// 初回限定ボーナスをもらう
export async function startBonus(addr: string): Promise<void> {
  await bitFruit.wallet.initialize();
  const tx = await bitFruit.createStartBonusTx(addr);
  await addWhiteTx(tx);
}

// 残高照会
export function balanceInquiry() {
}

// 処理待ちの Tx を追加する
// (WebSocket クライアント > サーバー)
export async function addWhiteTx(tx: Tx): Promise<void> {
  whiteTxList.push(tx);
  const fullNode = new FullNode();
  await fullNode.initialize();
  const dammyKey = await (await createSigningKeyPair()).publicKey;
  await fullNode.onReceiveWhiteTx(tx, dammyKey);
}
