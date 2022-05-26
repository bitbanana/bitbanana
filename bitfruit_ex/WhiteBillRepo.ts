//
//
//

import { Bill } from "./types/Bill.ts";
import { Collection } from "../mongo/Collection.ts";

export class WhiteBillRepo {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/whitebills.json";
  // 取得
  async loadWhiteBills(): Promise<Bill[]> {
    const c = new Collection<Bill>("whitebills");
    const bills = await c.find({});
    return bills;
  }
  // 追加
  async insertWhiteBill(bill: Bill): Promise<void> {
    const c = new Collection<Bill>("whitebills");
    await c.insertOne(bill);
  }
  // 削除
  async removeWhiteBill(bill: Bill): Promise<void> {
    const c = new Collection<Bill>("whitebills");
    await c.deleteMany({ "id": bill.id });
  }
}
