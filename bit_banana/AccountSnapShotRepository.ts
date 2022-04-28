import { AccountSnapshot } from "./types/AccountSnapshot.ts";

export class AccountSnapShotRepository {
  file = "./bit_banana/storage/bitbanana_wallet.json";

  // 読み込み
  async findSnapshot(addr: string): Promise<AccountSnapshot | null> {
    const text = await Deno.readTextFile(this.file);
    const snapshots: AccountSnapshot[] = JSON.parse(text);
    const snapshot = snapshots.find((e) => e.addr === addr) ?? null;
    return snapshot;
  }

  // 保存
  async saveSnapshot(snapshot: AccountSnapshot): Promise<void> {
    let text = await Deno.readTextFile(this.file);
    let snapshots: AccountSnapshot[] = JSON.parse(text);
    // 古いスナップショットを削除
    snapshots = snapshots.filter((e) => e.addr !== snapshot.addr);
    // 新しいスナップショットを追加
    snapshots.push(snapshot);
    text = JSON.stringify(snapshots, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.file, text, opt);
  }
}
