import { BlockchainRepo } from "../BlockchainRepo.ts";
import { BalanceSnapshot } from "../types/BalanceSnapshot.ts";
import { BalanceSnapshotRepo } from "../BalanceSnapshotRepo.ts";
import { createBalanceSnapshot } from "./createBalanceSnapshot.ts";

export async function balanceInquiry(addr: string): Promise<number> {
  const sRepo = new BalanceSnapshotRepo();
  let snapshot = await sRepo.findSnapshot(addr);
  // 必要なブロックの最小インデックス(このindexを含まない)
  const minIndex = snapshot?.latest_block_index ?? 0;
  // ブロックを取得
  const bcRepo = new BlockchainRepo();
  const blocks = await bcRepo.findAfterIndex(minIndex);
  // スナップショットがない場合は作成
  if (snapshot == null) {
    const newSnapshot: BalanceSnapshot = {
      latest_block_index: 0,
      // ジェネシスブロック
      latest_block_hash:
        "c1c9d8bab7cbca7fe6a69e9df06fc4b17cb6c366412c12b31edb6e8eb8dc6572",
      addr: addr,
      balance: 0,
    };
    snapshot = newSnapshot;
  }
  snapshot = createBalanceSnapshot(blocks, snapshot!, addr);
  // スナップショットを更新
  await sRepo.saveSnapshot(snapshot!);
  return snapshot!.balance;
}
