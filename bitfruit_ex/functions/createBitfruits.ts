// utils
import { yyyyMMdd } from "../../utils/mod.ts";

// others
import { Bitfruit } from "../types/Bitfruit.ts";
import { TradeConfig } from "../types/TradeConfig.ts";
import { BitfruitRepo } from "../BitfruitRepo.ts";
import { tradeConfigs } from "../config/config.ts";

// その日のビットフルーツを作成する
export async function createBitfruits() {
  // yyyymmdd
  const today = new Date();
  const ytd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  const todayYyyymmdd = yyyyMMdd(today);
  const ytdYyyymmdd = yyyyMMdd(ytd);
  // Repo
  const fRepo = new BitfruitRepo();
  // 今日のビットフルーツ
  const todayFruits = await fRepo.loadFruitsByDate(todayYyyymmdd);
  if (todayFruits.length > 0) {
    console.log(`Today Bitfruits Already Exist`);
    return;
  }
  // 昨日のビットフルーツ
  const ytdFruits = await fRepo.loadFruitsByDate(ytdYyyymmdd);
  // 取り扱いが必要な全てのフルーツに対して
  for await (const conf of tradeConfigs) {
    // 昨日のフルーツを見つける
    let ytdFruit = ytdFruits.find((e) => e.fruit_id == conf.fruit_id);
    if (ytdFruit == undefined || ytdFruit == null) {
      // 昨日のフルーツが見つからなかったら新しく作り直す
      console.log(`ytdF not found. newF created`);
      ytdFruit = newBitfruit(conf, ytdYyyymmdd);
    }
    // 更新
    const todayFruit = ytdFruit;
    todayFruit.yyyymmdd = todayYyyymmdd;
    todayFruit.buy_count = 0;
    todayFruit.sell_count = 0;
    // 登録
    todayFruits.push(todayFruit);
  }
  // 保存
  await fRepo.saveFruits(todayFruits);
}

/// 新規で作成するBitfruit
export function newBitfruit(
  config: TradeConfig,
  yyyymmdd: string,
): Bitfruit {
  return {
    fruit_id: config.fruit_id,
    yyyymmdd: yyyymmdd,
    buy_count: 0,
    sell_count: 0,
    price_ytd: config.origin_price,
    price: config.origin_price,
  };
}
