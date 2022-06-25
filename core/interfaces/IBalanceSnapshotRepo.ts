//
//
//

// in-mod
import { BalanceSnapshot } from "../types/BalanceSnapshot.ts";

/// IBalanceSnapshotRepo
export interface IBalanceSnapshotRepo {
  // 読み込み
  findSnapshot(addr: string): Promise<BalanceSnapshot | null>;
  // 保存
  saveSnapshot(snapshot: BalanceSnapshot): Promise<void>;
}
