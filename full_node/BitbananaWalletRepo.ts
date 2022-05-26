import { BitbananaWallet } from "./types/BitbananaWallet.ts";
import { VERSION } from "../full_node/config.ts";

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
      version: VERSION,
    };
    return wallet;
  }

  // 保存
  async saveWallet(wallet: BitbananaWallet): Promise<void> {
  }
}
