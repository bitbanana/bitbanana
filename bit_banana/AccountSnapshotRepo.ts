import { AccountSnapshot } from "./types/AccountSnapshot.ts";
import { Collection } from "../mongo/Collection.ts";

export class AccountSnapshotRepo {
  file = "./bit_banana/db/AccountSnapshots.json";

  // 読み込み
  async findSnapshot(addr: string): Promise<AccountSnapshot | null> {
    const c = new Collection<AccountSnapshot>("accountsnapshots");
    const snapshot = await c.findOne({ "addr": addr });
    return snapshot;
    // const text = await Deno.readTextFile(this.file);
    // const snapshots: AccountSnapshot[] = JSON.parse(text);
    // const snapshot = snapshots.find((e) => e.addr === addr) ?? null;
    // return snapshot;
  }

  // 保存
  async saveSnapshot(snapshot: AccountSnapshot): Promise<void> {
    const c = new Collection<AccountSnapshot>("accountsnapshots");
    await c.replaceOne({ "addr": snapshot.addr }, snapshot);
    // let text = await Deno.readTextFile(this.file);
    // let snapshots: AccountSnapshot[] = JSON.parse(text);
    // // 古いスナップショットを削除
    // snapshots = snapshots.filter((e) => e.addr !== snapshot.addr);
    // // 新しいスナップショットを追加
    // snapshots.push(snapshot);
    // text = JSON.stringify(snapshots, null, 2);
    // const opt = { append: false, create: false };
    // await Deno.writeTextFile(this.file, text, opt);
  }
}
