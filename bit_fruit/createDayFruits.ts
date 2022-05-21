import { DayFruit } from "./types/DayFruit.ts";
import { yyyyMMdd } from "../utils/date_format.ts";
import { Collection } from "../mongo/Collection.ts";
import { dayFruitConfigs } from "./dayFruitConfigs.ts";
import { defaultDayFruits } from "./defaultDayFruits.ts";

// その日の最初に実行される
export async function createDayFruits() {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  console.log(`DayFruits Create ${todayYyyymmdd}`);
  const ytd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );
  const ytdYyyymmdd = yyyyMMdd(ytd);

  const c = new Collection<DayFruit>("dayfruits");
  const todayFruits = await c.find({ "yyyymmdd": todayYyyymmdd });
  console.log(`Step 1...`);

  // ローカル版
  // const dfRepo = new DayFruitRepo();
  // const todayFruits = await dfRepo.loadFruitsByDate(todayYyyymmdd);
  if (todayFruits.length > 0) {
    console.log(`DayFruits Already Exist`);
    return;
  }
  // const ytdFruits = await dfRepo.loadFruitsByDate(ytdYyyymmdd);
  const ytdFruits = await c.find({ "yyyymmdd": ytdYyyymmdd });
  console.log(`Step 2...`);

  const defaultFruits = defaultDayFruits(todayYyyymmdd);
  for (const dfc of dayFruitConfigs) {
    const defaultFruit = defaultFruits.find((e) => e.fruit_id == dfc.fruit_id);
    if (defaultFruit == undefined) {
      throw new Error("default fruit not found");
    }
    let ytdFruit = ytdFruits.find((e) => e.fruit_id == dfc.fruit_id);
    if (ytdFruit == undefined) {
      ytdFruit = defaultFruit;
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
  console.log(`Step Complete`);
}
