//
//
//

// utils
import { MongoCollection } from "../utils/mod.ts";

// blockchain
import { BalanceSnapshot, IBalanceSnapshotRepo } from "../blockchain/mod.ts";

/// BalanceSnapshotRepo
export class BalanceSnapshotRepo implements IBalanceSnapshotRepo {
  collection = new MongoCollection<BalanceSnapshot>("balancesnapshots");
  // 読み込み
  async findSnapshot(addr: string): Promise<BalanceSnapshot | null> {
    const snapshot = await this.collection.findOne({ "addr": addr });
    return snapshot;
  }

  // 保存
  async saveSnapshot(snapshot: BalanceSnapshot): Promise<void> {
    await this.collection.replaceOne({ "addr": snapshot.addr }, snapshot);
  }
}
