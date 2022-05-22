import { DayFruit } from "./types/DayFruit.ts";
import { yyyyMMdd } from "../utils/date_format.ts";
import { Collection } from "../mongo/Collection.ts";
import { dayFruitConfigs } from "./dayFruitConfigs.ts";
import { newDayFruit } from "./newDayFruit.ts";

// その日の最初に実行される
export async function createDayFruits() {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  const ytd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  const ytdYyyymmdd = yyyyMMdd(ytd);

  const c = new Collection<DayFruit>("dayfruits");
  const todayFruits = await c.find({ "yyyymmdd": todayYyyymmdd });

  // ローカル版
  // const dfRepo = new DayFruitRepo();
  // const todayFruits = await dfRepo.loadFruitsByDate(todayYyyymmdd);
  if (todayFruits.length > 0) {
    console.log(`DayFruits Already Exist`);
    return;
  }
  // const ytdFruits = await dfRepo.loadFruitsByDate(ytdYyyymmdd);
  const ytdFruits = await c.find({ "yyyymmdd": ytdYyyymmdd });

  // 取り扱いが必要な全てのフルーツに対して
  for await (const dfc of dayFruitConfigs) {
    // 昨日のフルーツを見つける
    let ytdFruit = ytdFruits.find((e) => e.fruit_id == dfc.fruit_id);
    if (ytdFruit == undefined || ytdFruit == null) {
      // 昨日のフルーツが見つからなかったら新しく作り直す
      console.log(`ytdF not found. newF created`);
      ytdFruit = newDayFruit(dfc, todayYyyymmdd);
    }
    const todayFruit: DayFruit = {
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
