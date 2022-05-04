import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { balanceInquiry, startBonus } from "./web_api.ts";
import {
  buyFruits,
  seeFruits,
  seePockets,
  sellFruits,
} from "../bit_fruit/web_api.ts";
import { fullNode } from "./FullNode.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import type { RouterContext as XContext } from "https://deno.land/x/oak/mod.ts";
type RouterContext = XContext<any, any, any>;
// cors用のmodule
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { BuyOrder } from "../bit_fruit/types/BuyOrder.ts";
import { SellOrder } from "../bit_fruit/types/SellOrder.ts";

// 初期化
await fullNode.init();

const router = new Router();
router
  .get("/", (ctx: RouterContext) => {
    console.log("ルートアクセス");
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.body = "Hello Bit Banana!";
  })
  .post("/start-bonus", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("初回登録ボーナスアクセス");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json = JSON.parse(string);
    const addr: string = json["addr"];

    console.log(`あなたのアドレスは ${addr}`);

    // 本体処理を実行
    const res = await startBonus(addr);
    console.log(`あなたの新しい残高は ${res.new_balance}`);

    // レスポンスを返す
    ctx.response.body = {
      new_balance: res.new_balance,
    };
  })
  .post("/balance-inquiry", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");

    console.log("残高照会アクセス");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json = JSON.parse(string);
    const addr: string = json["addr"];

    console.log(`あなたのアドレスは ${addr}`);

    // 本体処理を実行
    const balance = await balanceInquiry(addr);
    console.log(`あなたの残高は ${balance}`);

    // レスポンスを返す
    ctx.response.body = {
      balance: balance,
    };
  })
  .post("/see-fruits", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("フルーツ価格を見るアクセス");
    // 本体処理を実行
    const fruits = await seeFruits();
    // レスポンスを返す
    ctx.response.body = {
      fruits: fruits,
    };
  })
  .post("/see-pockets", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("所有フルーツを見るアクセス");
    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json = JSON.parse(string);
    const addr: string = json["addr"];
    console.log(`あなたのアドレスは ${addr}`);
    // 本体処理を実行
    const pockets = await seePockets(addr);
    // レスポンスを返す
    ctx.response.body = {
      pockets: pockets,
    };
  })
  .post("/buy-fruits", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("フルーツを購入するアクセス");
    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const order: BuyOrder = JSON.parse(string);
    console.log(`購入注文: ${order}`);
    // 本体処理を実行
    const bill = await buyFruits(order);
    // レスポンスを返す
    ctx.response.body = {
      bill: bill,
    };
  })
  .post("/sell-fruits", async (ctx: RouterContext) => {
    // ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    console.log("フルーツを売却するアクセス");
    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const order: SellOrder = JSON.parse(string);
    console.log(`売却注文: ${order}`);
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
console.log(`Full-Node: Listening at PORT ${PORT}...`);
