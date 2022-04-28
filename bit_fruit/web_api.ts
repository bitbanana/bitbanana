import { Bitfruit } from "./types/BitFruit.ts";
import { BuyOrder } from "./types/BuyOrder.ts";
import { SellOrder } from "./types/SellOrder.ts";
import { Bill } from "./types/Bill.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";
import { bitfruitServer } from "./bit_fruit.ts";

await bitfruitServer.init();

// ビットフルーツ一覧を見る
export function seeBitfruits(): Bitfruit[] {
  return bitfruitServer.bitfruits;
}

// ビットフルーツの購入注文
export async function buyBitfruits(order: BuyOrder): Promise<Bill> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const bitfruits = seeBitfruits();
  const bitfruit = bitfruits.find((e) => e.id === order.bitfruit_id);
  if (bitfruit == null) {
    throw new Error("存在しないビットフルーツです");
  }
  const amount = bitfruit.price * order.count;
  // 請求書
  const bill: Bill = {
    id: id,
    tx_id: id,
    s_addr: order.addr,
    r_addr: "Bitfruit.V1.Free.Addr",
    created_at: now,
    amount: amount,
  };
  // 未処理のBillを追加
  bitfruitServer.whiteBills.push(bill);
  // データベースにも追加
  const wbRepo = new WhiteBillRepo();
  await wbRepo.saveWhiteBills(bitfruitServer.whiteBills);
  return bill;
}

// ビットフルーツを売却注文
export function sellBitFruits(order: SellOrder) {
}
