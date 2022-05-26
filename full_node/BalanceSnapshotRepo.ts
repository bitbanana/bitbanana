import { BalanceSnapshot } from "./types/BalanceSnapshot.ts";
import { Collection } from "../mongo/Collection.ts";

export class BalanceSnapshotRepo {
  // 読み込み
  async findSnapshot(addr: string): Promise<BalanceSnapshot | null> {
    const c = new Collection<BalanceSnapshot>("balancesnapshots");
    const snapshot = await c.findOne({ "addr": addr });
    return snapshot;
  }

  // 保存
  async saveSnapshot(snapshot: BalanceSnapshot): Promise<void> {
    const c = new Collection<BalanceSnapshot>("balancesnapshots");
    await c.replaceOne({ "addr": snapshot.addr }, snapshot);
  }
}
