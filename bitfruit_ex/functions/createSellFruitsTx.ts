// core
import { SenderSigContent, Tx } from "../../core/mod.ts";

// in-mod
import { bitfruitExAddr, bitfruitExTmpSig } from "../config/config.ts";
import { SellOrder } from "../types/SellOrder.ts";
import { seeFruits as _seeFruits } from "./seeFruits.ts";

/// トランザクションを作成
export async function createSellFruitsTx(order: SellOrder): Promise<Tx> {
  const fruits = await _seeFruits();
  const fruit = fruits.find((e) => e.fruit_id == order.fruit_id);
  if (fruit === undefined) {
    throw new Error(`Sell Not Found Fruit ID: ${order.fruit_id}`);
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
    s_addr: bitfruitExAddr,
    s_sig_cont: cont,
    s_sig: bitfruitExTmpSig,
  };
  return tx;
}
