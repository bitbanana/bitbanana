//
//
//

import { addWhiteTx, balanceInquiry, startBonus } from "./full_node/web_api.ts";
import {
  buyFruits,
  seeFruits,
  seePockets,
  sellFruits,
} from "./bitfruit_ex/web_api.ts";
import { fullNode } from "./full_node/FullNode.ts";
import { Application, Router } from "./deps.ts";
import { RouterContext } from "./deps.ts";
import { oakCors } from "./deps.ts";
import { BuyOrder } from "./bitfruit_ex/types/BuyOrder.ts";
import { SellOrder } from "./bitfruit_ex/types/SellOrder.ts";
import { Tx } from "./full_node/types/Tx.ts";
import { updateBitfruits } from "./bitfruit_ex/updateBitfruits.ts";
import { createBitfruits } from "./bitfruit_ex/createBitfruits.ts";
import { datetime } from "./deps.ts";
import { VERSION } from "./full_node/config.ts";
import { bitfruitEx } from "./bitfruit_ex/BitfruitEx.ts";

// 初期化
await fullNode.init(); // FullNode
await bitfruitEx.init(); // BitfruitEx

const router = new Router();
router
  .get("/", (ctx: RouterContext) => {
    ctx.response.body = `Hello Bit Banana! ${VERSION}`;
  })
  .post("/start-bonus", async (ctx: RouterContext) => {
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
    console.log("Req: see-fruits");

    // 本体処理を実行
    const fruits = await seeFruits();
    // レスポンスを返す
    ctx.response.body = {
      fruits: fruits,
    };
  })
  .post("/see-pockets", async (ctx: RouterContext) => {
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
  .post("/add-white-tx-bitfruit", async (ctx: RouterContext) => {
    console.log("Req: add-white-tx-bitfruit");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const tx: Tx = JSON.parse(string);
    // 取引が1つであることを確認
    if (tx.pages.length != 1) {
      ctx.response.body = { message: "複数の取引には現在対応しておりません" };
      return;
    }
    // 宛先がビットフルーツであることを確認
    if (tx.pages[0].cont.r_addr !== "Bitfruit.V1.Free.Addr") {
      ctx.response.body = { message: "宛先が不正です" };
      return;
    }
    // 本体処理を実行
    await addWhiteTx(tx);
    // レスポンスを返す
    ctx.response.body = {};
  })
  .post("/sell-fruits", async (ctx: RouterContext) => {
    console.log("Req: sell-fruits");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const order: SellOrder = JSON.parse(string);
    // 本体処理を実行
    await sellFruits(order);
    // レスポンスを返す
    ctx.response.body = {};
  })
  .post("/update-bitfruits", async (ctx: RouterContext) => {
    // 毎日 11-12, 19-20時に実行
    console.log("Req: update-bitfruits");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json: { api_key: string } = JSON.parse(string);
    const API_KEY = Deno.env.get("CRON_API_KEY");
    if (json.api_key !== API_KEY) {
      ctx.response.body = { message: "不正なAPIKeyです" };
      return;
    }
    await updateBitfruits();
    ctx.response.body = { message: "UPDATE を実施しました" };
  })
  .post("/create-bitfruits", async (ctx: RouterContext) => {
    // 毎日 3-4時に実行
    console.log("Req: create-bitfruits");

    // 必要なパラメータを取り出す
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json: { api_key: string } = JSON.parse(string);
    const API_KEY = Deno.env.get("CRON_API_KEY");
    if (json.api_key !== API_KEY) {
      ctx.response.body = { message: "不正なAPIKeyです" };
      return;
    }
    await createBitfruits();
    ctx.response.body = { message: "CREATE を実施しました" };
  });

const app = new Application();

app.use(oakCors());
app.use(router.routes());
// routerの設定を読み取り、許可するHTTPメソッドを自動設定
app.use(router.allowedMethods());

// 8000 ポートで起動
const PORT = 8000;
app.listen({ port: PORT });

const now = datetime().toZonedTime("Asia/Tokyo");
const nowStr = now.format("YY/MM/dd HH:mm");
console.log(`🚀Started at [${nowStr}] on PORT:${PORT}...`);
