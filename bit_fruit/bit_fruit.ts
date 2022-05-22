//
//
//

import { DayFruitRepo } from "./DayFruitRepo.ts";
import { createDayFruits } from "./createDayFruits.ts";
import { Wallet } from "../wallet/wallet.ts";
import { FruitPocket } from "./types/FruitPocket.ts";
import { FruitPocketRepo } from "./FruitPocketRepo.ts";
import { Block, SenderSigContent } from "../blockchain/mod.ts";
import { yyyyMMdd } from "../utils/date_format.ts";
import { createStartBonusTx as startBonusTx } from "./create_start_bonus_tx.ts";
import { Follower } from "../bit_banana/follower.ts";
import { Bill } from "./types/Bill.ts";
import { Tx } from "../bit_banana/types/Tx.ts";
import { SellOrder } from "./types/SellOrder.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";
import { fullNode } from "../bit_banana/FullNode.ts";

export class BitFruit implements Follower {
  wallet: Wallet;

  constructor() {
    this.wallet = new Wallet(
      "./bit_fruit/keychain",
      "./bit_fruit/storage/key_value.json",
    );
  }

  async init(): Promise<void> {
    await createDayFruits();
    fullNode.followers.push(this);
  }

  onRedTx(tx: Tx): void {
    throw new Error("トランザクション拒否時の処理がありません");
  }

  async onGreenTx(tx: Tx): Promise<void> {
    const billRepo = new WhiteBillRepo();
    const allBills = await billRepo.loadWhiteBills();
    const greenBills = allBills.filter((bo) =>
      bo.tx_id === tx.pages[0].cont.tx_id
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
    const dfRepo = new DayFruitRepo();
    const date = yyyyMMdd(new Date());
    const dayFruit = await dfRepo.loadFruit(bill.buy_order.fruit_id, date);
    dayFruit.buy_count += bill.buy_order.count;
    await dfRepo.updateFruit(dayFruit);
    // 購入者の所有数を増やす
    const pRepo = new FruitPocketRepo();
    const pockets = await pRepo.loadPockets(bill.buy_order.addr);
    let pocket = pockets.find((e) => e.fruit_id === bill.buy_order.fruit_id);
    if (pocket === undefined) {
      const newPocket: FruitPocket = {
        owner_addr: bill.buy_order.addr,
        fruit_id: bill.buy_order.fruit_id,
        count: bill.buy_order.count,
      };
      pocket = newPocket;
    }
    pocket!.count += bill.buy_order.count;
    await pRepo.savePocket(pocket!);
  }

  // 売却されたとき (pocketの管理のみ)
  async onUserSellFruits(order: SellOrder) {
    // 集計 売られた数を1増やす
    const dfRepo = new DayFruitRepo();
    const date = yyyyMMdd(new Date());
    const dayFruit = await dfRepo.loadFruit(order.fruit_id, date);
    dayFruit.sell_count += order.count;
    await dfRepo.updateFruit(dayFruit);
    // 購入者の所有数を減らす
    const pRepo = new FruitPocketRepo();
    const pockets = await pRepo.loadPockets(order.addr);
    let pocket = pockets.find((e) => e.fruit_id === order.fruit_id);
    if (pocket === undefined) {
      const newPocket: FruitPocket = {
        owner_addr: order.addr,
        fruit_id: order.fruit_id,
        count: order.count,
      };
      pocket = newPocket;
    }
    pocket!.count -= order.count;
    await pRepo.savePocket(pocket!);
  }
}

export const bitfruitServer = new BitFruit();
