import { DayFruit } from "./types/DayFruit.ts";
import { DayFruitRepo } from "./DayFruitRepo.ts";
import { yyyyMMdd } from "../utils/date_format.ts";

// その日の最初に実行される
export async function createDayFruits() {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  const ytd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
  );

  const dfRepo = new DayFruitRepo();
  const todayFruits = await dfRepo.loadFruitsByDate(todayYyyymmdd);
  if (todayFruits.length > 0) {
    console.log("すでに本日のDayFruitsが作成されていたため処理を停止します");
    return;
  }
  const ytdFruits = await dfRepo.loadFruitsByDate(yyyyMMdd(ytd));
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
  await dfRepo.saveFruits(todayFruits);
}
