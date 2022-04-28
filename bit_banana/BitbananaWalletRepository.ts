import { BitbananaWallet } from "./types/BitBananaWallet.ts";

export class BitbananaWalletRepository {
  file = "./bit_banana/storage/bitbanana_wallet.json";

  // 読み込み
  async loadWallet(): Promise<BitbananaWallet | null> {
    const text = await Deno.readTextFile(this.file);
    if (text == "") {
      return null;
    }
    const wallet: BitbananaWallet = JSON.parse(text);
    return wallet;
  }

  // 保存
  async saveWallet(wallet: BitbananaWallet): Promise<void> {
    const text = JSON.stringify(wallet, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.file, text, opt);
  }
}
