//
//
//

import { BitfruitRepo } from "./BitfruitRepo.ts";
import { createBitfruits } from "./createBitfruits.ts";
import { FruitPocket } from "./types/FruitPocket.ts";
import { FruitPocketRepo } from "./FruitPocketRepo.ts";
import { yyyyMMdd } from "../utils/date_format.ts";
import { Follower } from "../full_node/Follower.ts";
import { Bill } from "./types/Bill.ts";
import { Tx } from "../blockchain/types/Tx.ts";
import { SellOrder } from "./types/SellOrder.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";
import { node1 } from "../node1/Node1.ts";
import { state } from "../full_node/State.ts";

export class BitfruitEx implements Follower {
  async init(): Promise<void> {
    await createBitfruits();
    state.followers.push(this);
  }

  onRedTx(tx: Tx): void {
    throw new Error("トランザクション拒否時の処理がありません");
  }

  async onGreenTx(tx: Tx): Promise<void> {
    const billRepo = new WhiteBillRepo();
    const allBills = await billRepo.loadWhiteBills();
    const greenBills = allBills.filter((bo) =>
      bo.tx_id === tx.s_sig_cont.tx_id
    );
    if (greenBills.length > 1) {
      throw new Error("[!] 重複した購入注文が存在します");
    }
    if (greenBills.length === 1) {
      const bill = greenBills[0];
      // 未払いのBillから削除
      await billRepo.removeWhiteBill(bill);
      await this.onGreenBill(bill);
      return;
    }
    console.warn("管理外のTxを受け取りました");
  }

  // 支払いが確認できた時
  async onGreenBill(bill: Bill) {
    // 集計 買われた数を1増やす
    const fruitRepo = new BitfruitRepo();
    const date = yyyyMMdd(new Date());
    const fruit = await fruitRepo.loadFruit(bill.buy_order.fruit_id, date);
    fruit.buy_count += bill.buy_order.count;
    await fruitRepo.updateFruit(fruit);
    // 購入者の所有数を増やす
    const pocketRepo = new FruitPocketRepo();
    const diff = bill.buy_order.count;
    await pocketRepo.incrementCount(
      bill.buy_order.addr,
      bill.buy_order.fruit_id,
      diff,
    );
  }

  // 売却されたとき (pocketの管理のみ)
  async onUserSellFruits(order: SellOrder) {
    // 集計 売られた数を1増やす
    const fruitRepo = new BitfruitRepo();
    const date = yyyyMMdd(new Date());
    const fruit = await fruitRepo.loadFruit(order.fruit_id, date);
    fruit.sell_count += order.count;
    await fruitRepo.updateFruit(fruit);
    // 購入者の所有数を減らす
    const pocketRepo = new FruitPocketRepo();
    const diff = -order.count;
    await pocketRepo.incrementCount(order.addr, order.fruit_id, diff);
  }
}

export const bitfruitEx = new BitfruitEx();
