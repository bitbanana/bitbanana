import { Cron } from "https://cdn.jsdelivr.net/gh/hexagon/croner@4/src/croner.js";
import { createDayFruits } from "./createDayFruits.ts";
import { updateDayFruits } from "./updateDayFruits.ts";

// 18時30分に実行
const _ = new Cron("0 30 18 * * *", {
  timezone: "Asia/Tokyo",
}, () => {
  console.log("価格を作成します");
  updateDayFruits();
});
