// utils
import { yyyyMMdd } from "../../utils/mod.ts";

// in-mod
import { Bitfruit } from "../types/Bitfruit.ts";
import { tradeConfigs } from "../config/config.ts";
import { BitfruitRepo } from "../BitfruitRepo.ts";

// 定期実行される ビットフルーツ価格更新
export async function updateBitfruits() {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  // 通信
  const fRepo = new BitfruitRepo();
  const oldFruits = await fRepo.loadFruitsByDate(todayYyyymmdd);

  const newFruits: Bitfruit[] = [];
  for await (const oldF of oldFruits) {
    const conf = tradeConfigs.find((e) => e.fruit_id === oldF.fruit_id);
    if (conf === undefined) {
      throw new Error("フルーツ設定値が見つかりませんでした");
    }
    const diff = (oldF.buy_count - oldF.sell_count) * conf.trade_rate_price;
    const newPrice = oldF.price_ytd + parseInt(Math.trunc(diff).toFixed()); //小数点切り捨て
    // 金額のみ更新
    const newF = oldF;
    newF.price = newPrice;
    newFruits.push(newF);
  }
  await fRepo.updateMany(newFruits);
}
