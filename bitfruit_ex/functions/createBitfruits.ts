import { Bitfruit } from "../types/Bitfruit.ts";
import { yyyyMMdd } from "../../utils/date_format.ts";
import { Collection } from "../../mongo/Collection.ts";
import { tradeConfigs } from "../config/config.ts";
import { TradeConfig } from "../types/TradeConfig.ts";

// その日のビットフルーツを作成する
export async function createBitfruits() {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  const ytd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  const ytdYyyymmdd = yyyyMMdd(ytd);

  const c = new Collection<Bitfruit>("bitfruits");
  const todayFruits = await c.find({ "yyyymmdd": todayYyyymmdd });

  if (todayFruits.length > 0) {
    console.log(`Today Bitfruits Already Exist`);
    return;
  }
  // const ytdFruits = await dfRepo.loadFruitsByDate(ytdYyyymmdd);
  const ytdFruits = await c.find({ "yyyymmdd": ytdYyyymmdd });

  // 取り扱いが必要な全てのフルーツに対して
  for await (const dfc of tradeConfigs) {
    // 昨日のフルーツを見つける
    let ytdFruit = ytdFruits.find((e) => e.fruit_id == dfc.fruit_id);
    if (ytdFruit == undefined || ytdFruit == null) {
      // 昨日のフルーツが見つからなかったら新しく作り直す
      console.log(`ytdF not found. newF created`);
      ytdFruit = newBitfruit(dfc, todayYyyymmdd);
    }
    const todayFruit: Bitfruit = {
      fruit_id: ytdFruit.fruit_id,
      yyyymmdd: todayYyyymmdd,
      buy_count: 0,
      sell_count: 0,
      price_ytd: ytdFruit.price,
      price: ytdFruit.price,
    };
    todayFruits.push(todayFruit);
  }

  // 保存
  await c.insertMany(todayFruits);
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
