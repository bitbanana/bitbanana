import { SenderSigContent } from "../blockchain/mod.ts";

// utils
import { createSigningKeyPair } from "../utils/signing_key_pair.ts";

import { fullNode } from "./FullNode.ts";

import { Tx } from "./types/Tx.ts";

startBonus("rubydog", "Rubydog.Free.Adrress");

// 初回限定ボーナスをもらう
// 公開鍵をサーバーに登録する
export async function startBonus(addr: string, pubKey: string): Promise<void> {
  await fullNode.init();
  const con = await fullNode.createStartBonusTx(addr, pubKey);
  const sSig = fullNode.sSig(con);
  const sAddr = fullNode.wallet!.addr;
  const tx: Tx = {
    sAddr: sAddr,
    con: con,
    sSig: sSig,
  };
  await addWhiteTx(tx);
}

// 残高照会 (全レコード参照)
export function balanceInquiry() {
}

// 処理待ちの Tx を追加する
// (WebSocket クライアント > サーバー)
export async function addWhiteTx(
  tx: Tx,
): Promise<void> {
  fullNode.whiteTxList.push(tx);
  await fullNode.onReceiveWhiteTx();
}
