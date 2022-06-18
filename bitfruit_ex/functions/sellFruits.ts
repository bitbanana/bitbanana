//
//
//

// node1
import { node1 } from "../../node1/mod.ts";

// blockchain
import { SenderSigContent, Tx } from "../../blockchain/mod.ts";

// in-mod
import { SellOrder } from "../types/SellOrder.ts";
import { bitfruitExAddr, bitfruitExTmpSig } from "../config/config.ts";
import { startBonus as _startBonus } from "./startBonus.ts";
import { seeFruits as _seeFruits } from "./seeFruits.ts";
import { seePockets as _seePockets } from "./seePockets.ts";
import { buyFruits as _buyFruits } from "./buyFruits.ts";
import { Trader } from "../Trader.ts";

export async function sellFruits(order: SellOrder): Promise<void> {
  const trader = new Trader();
  // 集計 売られた数を1増やす
  await trader.incSellCount(order);
  // 購入者の所有数を減らす
  await trader.decPocketCount(order);
  // 支払いtxを作成
  const fruits = await _seeFruits();
  const fruit = fruits.find((e) => e.fruit_id == order.fruit_id);
  if (fruit === undefined) {
    console.log("Sell Bitfruits Not Found");
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
  // 送金
  await node1.fullNode.addWhiteTx(tx);
}
