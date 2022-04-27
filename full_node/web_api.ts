import { SenderSigContent } from "../blockchain/mod.ts";
import { bitFruit, FullNode, whiteTxList } from "./full_node.ts";
// utils
import { createSigningKeyPair } from "../utils/signing_key_pair.ts";

// 初回限定ボーナスをもらう
export async function startBonus(addr: string): Promise<void> {
  await bitFruit.wallet.initialize();
  const tx = await bitFruit.createStartBonusTx(addr);
  const baseCoinKey = await (await createSigningKeyPair()).publicKey;
  await addWhiteTx(tx, "これはBaseコインの署名です", baseCoinKey);
}

// 残高照会 (全レコード参照)
export function balanceInquiry() {
}

// 処理待ちの Tx を追加する
// (WebSocket クライアント > サーバー)
export async function addWhiteTx(
  con: SenderSigContent,
  sSig: string,
  pubKey: CryptoKey,
): Promise<void> {
  whiteTxList.push(con);
  const fullNode = new FullNode();
  await fullNode.initialize();
  await fullNode.onReceiveWhiteTx(sSig, con, pubKey);
}
