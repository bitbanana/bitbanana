import { Bitfruit } from "./types/Bitfruit.ts";
import { BuyOrder } from "./types/BuyOrder.ts";
import { SellOrder } from "./types/SellOrder.ts";
import { Bill } from "./types/Bill.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";
import { FruitPocket } from "./types/FruitPocket.ts";
import { FruitPocketRepo } from "./FruitPocketRepo.ts";
import { SenderSigContent } from "../blockchain/types/SenderSigContent.ts";
import { addWhiteTx } from "../full_node/web_api.ts";
import { Tx } from "../full_node/types/Tx.ts";
import { bitfruitEx } from "./BitfruitEx.ts";
import { Collection } from "../mongo/Collection.ts";
import { yyyyMMdd } from "../utils/date_format.ts";

// ビットフルーツ一覧を見る
export async function seeFruits(): Promise<Bitfruit[]> {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  // 通信
  const c = new Collection<Bitfruit>("bitfruits");
  const fruits = await c.find({ "yyyymmdd": todayYyyymmdd });
  return fruits;
}

// 所有数を確認
export async function seePockets(addr: string): Promise<FruitPocket[]> {
  const repo = new FruitPocketRepo();
  const pockets = await repo.loadPockets(addr);
  return pockets;
}

// ビットフルーツの購入注文
export async function buyFruits(order: BuyOrder): Promise<Bill> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const bitfruits = await seeFruits();
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
    r_addr: "@bitfruitex",
    created_at: now,
    amount: amount,
    buy_order: order,
  };
  // 未処理のBillを追加
  const wbRepo = new WhiteBillRepo();
  await wbRepo.insertWhiteBill(bill);
  return bill;
}

// ビットフルーツを売却注文
export async function sellFruits(order: SellOrder): Promise<void> {
  // pocketから減らす
  await bitfruitEx.onUserSellFruits(order);
  // 支払いtxを作成
  const fruits = await seeFruits();
  const fruit = fruits.find((e) => e.fruit_id == order.fruit_id);
  if (fruit === undefined) {
    console.log("Bitfruits Not Found");
  }
  const amount = fruit!.price * order.count;
  const uuid = crypto.randomUUID();
  const cont: SenderSigContent = {
    tx_id: uuid,
    r_addr: order.addr,
    amount: amount,
    fee: 0,
  };
  const tx: Tx = {
    s_addr: "@bitfruitex",
    s_sig_cont: cont,
    s_sig: "@bitfruitex.sig",
  };
  // 送金
  await addWhiteTx(tx);
}
