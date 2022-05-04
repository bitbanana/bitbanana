//
//
//

import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { balanceInquiry, startBonus } from "./bit_banana/web_api.ts";
import {
  buyFruits,
  seeFruits,
  seePockets,
  sellFruits,
} from "./bit_fruit/web_api.ts";
import { fullNode } from "./bit_banana/FullNode.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import type { RouterContext as XContext } from "https://deno.land/x/oak/mod.ts";
type RouterContext = XContext<any, any, any>;
// cors用のmodule
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { BuyOrder } from "./bit_fruit/types/BuyOrder.ts";
import { SellOrder } from "./bit_fruit/types/SellOrder.ts";
import { updateDayFruits } from "./bit_fruit/updateDayFruits.ts";
import { createDayFruits } from "./bit_fruit/createDayFruits.ts";
import { Cron } from "https://cdn.jsdelivr.net/gh/hexagon/croner@4/src/croner.js";
import { datetime } from "./deps.ts";
import { VERSION } from "./bit_banana/config.ts";

// 初期化
await fullNode.init();

const router = new Router();
router
  .get("/", (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.body = `Hello Bit Banana! ${VERSION}`;
  })
  .post("/start-bonus", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("Req: start-bonus");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json = JSON.parse(string);
    const addr: string = json["addr"];
    // 本体処理を実行
    const res = await startBonus(addr);
    // レスポンスを返す
    ctx.response.body = {
      new_balance: res.new_balance,
    };
  })
  .post("/balance-inquiry", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("Req: balance-inquiry");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json = JSON.parse(string);
    const addr: string = json["addr"];
    // 本体処理を実行
    const balance = await balanceInquiry(addr);
    // レスポンスを返す
    ctx.response.body = {
      balance: balance,
    };
  })
  .post("/see-fruits", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("Req: see-fruits");
    // 本体処理を実行
    const fruits = await seeFruits();
    // レスポンスを返す
    ctx.response.body = {
      fruits: fruits,
    };
  })
  .post("/see-pockets", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("Req: see-pockets");
    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json = JSON.parse(string);
    const addr: string = json["addr"];
    // 本体処理を実行
    const pockets = await seePockets(addr);
    // レスポンスを返す
    ctx.response.body = {
      pockets: pockets,
    };
  })
  .post("/buy-fruits", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("Req: buy-fruits");
    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const order: BuyOrder = JSON.parse(string);
    // 本体処理を実行
    const bill = await buyFruits(order);
    // レスポンスを返す
    ctx.response.body = {
      bill: bill,
    };
  })
  .post("/sell-fruits", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("Req: sell-fruits");
    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const order: SellOrder = JSON.parse(string);
    // 本体処理を実行
    await sellFruits(order);
    // レスポンスを返す
    ctx.response.body = {};
  });

const app = new Application();

app.use(oakCors());
app.use(router.routes());
// routerの設定を読み取り、許可するHTTPメソッドを自動設定
app.use(router.allowedMethods());

// 8000 ポートで起動
const PORT = 8000;
app.listen({ port: PORT });

// 毎日 6,12,18時に実行
const _ = new Cron("0 0 6,12,18 * * *", {
  timezone: "Asia/Tokyo",
}, () => {
  updateDayFruits();
});

// 毎日 0時に実行
const __ = new Cron("0 0 0 * * *", {
  timezone: "Asia/Tokyo",
}, () => {
  createDayFruits();
});

const now = datetime().toZonedTime("Asia/Tokyo");
const nowStr = now.format("YY/MM/dd HH:mm");
console.log(`✨ NewDeploy [${nowStr}] PORT:${PORT}...`);
