//
//
//

// in-mod
import { Bill } from "../types/Bill.ts";
import { WhiteBillRepo } from "../WhiteBillRepo.ts";
import { BuyOrder } from "../types/BuyOrder.ts";
import { bitfruitExAddr } from "../config/config.ts";
import { startBonus as _startBonus } from "./startBonus.ts";
import { seeFruits as _seeFruits } from "./seeFruits.ts";
import { seePockets as _seePockets } from "./seePockets.ts";

export async function buyFruits(order: BuyOrder): Promise<Bill> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const bitfruits = await _seeFruits();
  const bitfruit = bitfruits.find((e) => e.fruit_id === order.fruit_id);
  if (bitfruit == null) {
    throw new Error("存在しないビットフルーツです");
  }
  const amount = bitfruit.price * order.count;
  // 請求書
  const bill: Bill = {
    id: id,
    tx_id: id,
    s_addr: order.addr,
    r_addr: bitfruitExAddr,
    created_at: now,
    amount: amount,
    buy_order: order,
  };
  // 未処理のBillを追加
  const wbRepo = new WhiteBillRepo();
  await wbRepo.insertWhiteBill(bill);
  return bill;
}
