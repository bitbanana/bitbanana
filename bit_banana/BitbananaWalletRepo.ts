import { BitbananaWallet } from "./types/BitbananaWallet.ts";

export class BitbananaWalletRepo {
  file = "./bit_banana/storage/bitbanana_wallet.json";

  // 読み込み
  // deno-lint-ignore require-await
  async loadWallet(): Promise<BitbananaWallet | null> {
    const wallet: BitbananaWallet = {
      addr: "Coinbase.V1.Free.Addr",
      jwk: "Coinbase.V1.Key",
      balance_memo: 0,
      nickname: "Coinbase",
      created_at: "2022-05-03T00:00:00.000Z",
      version: "0.0.1",
    };
    return wallet;
    // const text = await Deno.readTextFile(this.file);
    // if (text == "") {
    //   return null;
    // }
    // const wallet: BitbananaWallet = JSON.parse(text);
    // return wallet;
  }

  // 保存
  async saveWallet(wallet: BitbananaWallet): Promise<void> {
    // const text = JSON.stringify(wallet, null, 2);
    // const opt = { append: false, create: false };
    // await Deno.writeTextFile(this.file, text, opt);
  }
}
