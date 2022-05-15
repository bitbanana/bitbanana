import { DayFruit } from "./types/DayFruit.ts";
import { DayFruitRepo } from "./DayFruitRepo.ts";
import { yyyyMMdd } from "../utils/date_format.ts";
import { Collection } from "../mongo/Collection.ts";
import { fixedFruits } from "./fixedFruits.ts";
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
  let ytdFruits = await c.find({ "yyyymmdd": ytdYyyymmdd });
  console.log(`Step 2...`);
  if (ytdFruits.length === 0) {
    console.log(`Yesterday Fruits Not Exist`);
    ytdFruits = defaultDayFruits(todayYyyymmdd);
  }
  for (const ytdF of ytdFruits) {
    const todayF: DayFruit = {
      fruit_id: ytdF.fruit_id,
      yyyymmdd: todayYyyymmdd,
      buy_count: 0,
      sell_count: 0,
      price_ytd: ytdF.price,
      price: ytdF.price,
    };
    todayFruits.push(todayF);
  }
  // 保存
  await c.insertMany(todayFruits);
  console.log(`Step Complete`);
}
