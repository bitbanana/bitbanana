//
//
//

// mongo
import { Collection } from "../mongo/Collection.ts";

// others
import { Bill } from "./types/Bill.ts";

/// WhiteBillRepo
export class WhiteBillRepo {
  // 取得
  async loadWhiteBills(txId: string): Promise<Bill[]> {
    const c = new Collection<Bill>("whitebills");
    const bills = await c.find({ "tx_id": txId });
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
