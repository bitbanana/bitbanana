import { Block } from "../blockchain/mod.ts";
import { AccountSnapshot } from "./types/AccountSnapshot.ts";

// 残高計算のアルゴリズム
// 1. スナップショットを取得する ない場合は作成する
// 2. スナップショット以降のブロックを取得する
// 3. 全てのブロックに対して
//    - 送信者の場合は amount, fee を引き算
//    - 受信者の場合は amount を足し算
//    - バリデーターの場合は fee を足し算

export function calcBalance(
  blocks: Block[],
  snapshot: AccountSnapshot,
  addr: string,
): AccountSnapshot {
  if (blocks.length <= 0) {
    console.log("計算するブロックがありません。残高は0です。");
    const tmpSnapshot: AccountSnapshot = {
      latest_block_index: 0,
      // ジェネシスブロック
      latest_block_hash:
        "cd4b506b735bc5fbe99c74bd5c45eeb3005b3a25a675f1a8c45a5233e04f3592",
      addr: addr,
      balance: 0,
    };
    return tmpSnapshot;
  }
  // 最古のブロック
  const oldestB = blocks[0];
  // 最新のブロック
  const latestB = blocks[blocks.length - 1];
  // 残高
  let balance = snapshot.balance;

  // スナップショットとの整合を確認
  if (
    oldestB.index !== snapshot.latest_block_index + 1 ||
    oldestB.prev_hash !== snapshot.latest_block_hash
  ) {
    throw new Error("スナップショットのデータがズレています");
  }

  // 全てのブロックに対して
  for (const block of blocks) {
    if (block.s_addr === addr) {
      // 自分が送信者だった場合
      balance -= block.amount;
      balance -= block.fee;
    }
    if (block.r_addr === addr) {
      // 自分が受信者だった場合
      balance += block.amount;
    }
    if (block.v_addr === addr) {
      // 自分がバリデーターだった場合
      balance += block.fee;
    }
  }
  // 新しいスナップショット
  const newSnapshot: AccountSnapshot = {
    latest_block_index: latestB.index,
    latest_block_hash: latestB.hash,
    addr: addr,
    balance: balance,
  };
  return newSnapshot;
}
