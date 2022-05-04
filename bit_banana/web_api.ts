import { Block, SenderSigContent } from "../blockchain/mod.ts";

// utils
import { createSigningKeyPair } from "../utils/signing_key_pair.ts";

import { fullNode } from "./FullNode.ts";

import { Tx } from "./types/Tx.ts";

import { AccountSnapshot } from "./types/AccountSnapshot.ts";
import { AccountSnapshotRepo } from "./AccountSnapshotRepo.ts";
import { BlockchainRepo } from "./BlockchainRepo.ts";

import { calcBalance } from "./calcBalance.ts";
import { StartBonusReq, StartBonusRes } from "./types/StartBonus.ts";

// 初回限定ボーナスをもらう (実は残高0なら何度でももらえる)
// 公開鍵をサーバーに登録する
export async function startBonus(
  addr: string,
): Promise<StartBonusRes> {
  const balance = await balanceInquiry(addr);
  console.log(`スタートボーナスをもらいに来た時の残高: ${balance}`);
  if (balance !== 0) {
    throw new Error("すでに残高が存在するためスタートボーナスはもらえません");
  }
  const tx = fullNode.createStartBonusTx(addr);
  await addWhiteTx(tx);
  const req: StartBonusRes = {
    new_balance: 5000,
  };
  return req;
}

// 残高照会 (全レコード参照)
export async function balanceInquiry(addr: string): Promise<number> {
  let sRepo = new AccountSnapshotRepo();
  let snapshot = await sRepo.findSnapshot(addr);
  // 必要なブロックの最小インデックス(このindexを含まない)
  let minIndex = snapshot?.latest_block_index ?? 0;
  // ブロックを取得
  const bcRepo = new BlockchainRepo();
  const blocks = await bcRepo.findAfterIndex(minIndex);
  // スナップショットがない場合は作成
  if (snapshot == null) {
    console.log("スナップショットを作成します");
    const newSnapshot: AccountSnapshot = {
      latest_block_index: 0,
      // ジェネシスブロック
      latest_block_hash:
        "cd4b506b735bc5fbe99c74bd5c45eeb3005b3a25a675f1a8c45a5233e04f3592",
      addr: addr,
      balance: 0,
    };
    snapshot = newSnapshot;
  }
  snapshot = calcBalance(blocks, snapshot!, addr);
  // スナップショットを更新
  await sRepo.saveSnapshot(snapshot);
  return snapshot.balance;
}

// 処理待ちの Tx を追加する
// (WebSocket クライアント > サーバー)
export async function addWhiteTx(
  tx: Tx,
): Promise<void> {
  fullNode.whiteTxList.push(tx);
  await fullNode.onReceiveWhiteTx();
}
