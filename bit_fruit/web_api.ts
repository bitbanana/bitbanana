import { DayFruit } from "./types/DayFruit.ts";
import { BuyOrder } from "./types/BuyOrder.ts";
import { SellOrder } from "./types/SellOrder.ts";
import { Bill } from "./types/Bill.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";
import { bitfruitServer } from "./bit_fruit.ts";
import { FruitPocket } from "./types/FruitPocket.ts";
import { FruitPocketRepo } from "./FruitPocketRepo.ts";
import { SenderSigContent } from "../blockchain/types/SenderSigContent.ts";
import { addWhiteTx } from "../bit_banana/web_api.ts";
import { Tx } from "../bit_banana/types/Tx.ts";

await bitfruitServer.init();

// ビットフルーツ一覧を見る
export function seeFruits(): DayFruit[] {
  return bitfruitServer.fruits;
}

// 所有数を確認
export async function seeFruitPockets(addr: string): Promise<FruitPocket[]> {
  const repo = new FruitPocketRepo();
  const pockets = await repo.loadPockets(addr);
  return pockets;
}

// ビットフルーツの購入注文
export async function buyFruits(order: BuyOrder): Promise<Bill> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const bitfruits = seeFruits();
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
    r_addr: "Bitfruit.V1.Free.Addr",
    created_at: now,
    amount: amount,
    buy_order: order,
  };
  // 未処理のBillを追加
  bitfruitServer.whiteBills.push(bill);
  // データベースにも追加
  const wbRepo = new WhiteBillRepo();
  await wbRepo.saveWhiteBills(bitfruitServer.whiteBills);
  return bill;
}

// ビットフルーツを売却注文
export async function sellFruits(order: SellOrder): Promise<void> {
  // txを作成
  const dayFruit = seeFruits().find((e) => e.fruit_id == order.fruit_id);
  if (dayFruit === undefined) {
    console.log("現在の価格が不明です");
  }
  const amount = dayFruit!.price * order.count;
  const uuid = crypto.randomUUID();
  const con: SenderSigContent = {
    tx_id: uuid,
    tx_page: 1,
    tx_all_pages: 1,
    r_addr: order.addr,
    amount: amount,
    fee: 0,
  };
  const tx: Tx = {
    sAddr: "BitFruit.V1.Free.Addr",
    con: con,
    sSig: "BitFruit.V1.Free.Sig",
  };
  // 送金
  await addWhiteTx(tx);
}
