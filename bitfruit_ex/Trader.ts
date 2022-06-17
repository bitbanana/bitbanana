//
//
//

// utils
import { yyyyMMdd } from "../utils/mod.ts";

// others
import { Bill } from "./types/Bill.ts";
import { SellOrder } from "./types/SellOrder.ts";
import { startBonus as _startBonus } from "./functions/startBonus.ts";
import { seeFruits as _seeFruits } from "./functions/seeFruits.ts";
import { seePockets as _seePockets } from "./functions/seePockets.ts";
import { buyFruits as _buyFruits } from "./functions/buyFruits.ts";
import { sellFruits as _sellFruits } from "./functions/sellFruits.ts";
import { BitfruitRepo } from "./BitfruitRepo.ts";
import { FruitPocketRepo } from "./FruitPocketRepo.ts";

/// Trader
export class Trader {
  // 集計 売られた数を1増やす
  async incSellCount(order: SellOrder) {
    const fruitRepo = new BitfruitRepo();
    const yyyymmdd = yyyyMMdd(new Date());
    await fruitRepo.incSellCount(order.fruit_id, yyyymmdd, order.count);
  }

  // 購入者の所有数を減らす
  async decPocketCount(order: SellOrder) {
    const pocketRepo = new FruitPocketRepo();
    const diff = -order.count;
    await pocketRepo.incCount(order.addr, order.fruit_id, diff);
  }

  // 集計 売られた数を1増やす
  async incBuyCount(bill: Bill) {
    const fruitRepo = new BitfruitRepo();
    const yyyymmdd = yyyyMMdd(new Date());
    await fruitRepo.incSellCount(
      bill.buy_order.fruit_id,
      yyyymmdd,
      bill.buy_order.count,
    );
  }

  // 購入者の所有数を増やす
  async incPocketCount(bill: Bill) {
    const pocketRepo = new FruitPocketRepo();
    const diff = bill.buy_order.count;
    await pocketRepo.incCount(
      bill.buy_order.addr,
      bill.buy_order.fruit_id,
      diff,
    );
  }
}
