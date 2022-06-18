// in-mod
import { BalanceSnapshot } from "../types/BalanceSnapshot.ts";
import { createBalanceSnapshot } from "./createBalanceSnapshot.ts";
import { IBalanceSnapshotRepo } from "../interfaces/IBalanceSnapshotRepo.ts";
import { IBlockchainRepo } from "../interfaces/IBlockchainRepo.ts";

export async function balanceInquiry(
  blockchainRepo: IBlockchainRepo,
  snapshotRepo: IBalanceSnapshotRepo,
  addr: string,
): Promise<number> {
  let snapshot = await snapshotRepo.findSnapshot(addr);
  // 必要なブロックの最小インデックス(このindexを含まない)
  const minIndex = snapshot?.latest_block_index ?? 0;
  // ブロックを取得
  const blocks = await blockchainRepo.findAfterIndex(minIndex);
  // スナップショットがない場合は作成
  if (snapshot == null) {
    // ジェネシスブロック
    const genesisBlock = blockchainRepo.getGenesisBlock();
    const newSnapshot: BalanceSnapshot = {
      latest_block_index: 0,
      latest_block_hash: genesisBlock.hash,
      addr: addr,
      balance: 0,
    };
    snapshot = newSnapshot;
  }
  snapshot = createBalanceSnapshot(blocks, snapshot!, addr);
  // スナップショットを更新
  await snapshotRepo.saveSnapshot(snapshot!);
  return snapshot!.balance;
}
