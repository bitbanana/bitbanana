//
//
//

import { Bill } from "./types/Bill.ts";

export class WhiteBillRepo {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/Bills.json";
  // 取得
  async loadWhiteBills(): Promise<Bill[]> {
    const text = await Deno.readTextFile(this.filePath);
    const bills: Bill[] = JSON.parse(text);
    return bills;
  }
  // 上書き
  async saveWhiteBills(bills: Bill[]): Promise<void> {
    const text = JSON.stringify(bills, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}
