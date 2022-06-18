//
//
//

// utils
import { MongoCollection } from "../utils/mod.ts";

// in-mod
import { Bill } from "./types/Bill.ts";

/// WhiteBillRepo
export class WhiteBillRepo {
  collection = new MongoCollection<Bill>("whitebills");
  // 取得
  async loadWhiteBills(txId: string): Promise<Bill[]> {
    const bills = await this.collection.find({ "tx_id": txId });
    return bills;
  }
  // 追加
  async insertWhiteBill(bill: Bill): Promise<void> {
    await this.collection.insertOne(bill);
  }
  // 削除
  async removeWhiteBill(bill: Bill): Promise<void> {
    await this.collection.deleteMany({ "id": bill.id });
  }
}
