import { AccountSnapshot } from "./types/AccountSnapshot.ts";

export class BitbananaWalletRepository {
  file = "./bit_banana/storage/bitbanana_wallet.json";

  // 読み込み
  async findSnapshot(): Promise<AccountSnapshot> {
    const text = await Deno.readTextFile(this.file);
    const snapshot: AccountSnapshot = JSON.parse(text);
    return snapshot;
  }

  // 保存
  async saveWallet(snapshot: AccountSnapshot): Promise<void> {
    const text = JSON.stringify(snapshot, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.file, text, opt);
  }
}
