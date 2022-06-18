//
//
//

// deps
import {
  Application,
  datetime,
  oakCors,
  Router,
  RouterContext,
} from "./deps.ts";

// blockchain
import { Tx } from "./blockchain/mod.ts";

// bitfruit_ex
import {
  bitfruitEx,
  bitfruitExAddr,
  BuyOrder,
  createBitfruits,
  SellOrder,
  updateBitfruits,
} from "./bitfruit_ex/mod.ts";

// node1
import { node1 } from "./node1/mod.ts";

// バージョン
const VERSION = "0.8.0";

// インスタンス初期化
await node1.init(); // FullNode
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
    const res = await bitfruitEx.startBonus(addr);
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
    const balance = await node1.fullNode.balanceInquiry(addr);
    // レスポンスを返す
    ctx.response.body = {
      balance: balance,
    };
  })
  .post("/see-fruits", async (ctx: RouterContext) => {
    console.log("Req: see-fruits");

    // 本体処理を実行
    const fruits = await bitfruitEx.seeFruits();
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
    const pockets = await bitfruitEx.seePockets(addr);
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
    const bill = await bitfruitEx.buyFruits(order);
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
    // 宛先がビットフルーツであることを確認
    if (tx.s_sig_cont.r_addr !== bitfruitExAddr) {
      ctx.response.body = { message: "宛先が不正です" };
      return;
    }
    // 本体処理を実行
    await node1.fullNode.addWhiteTx(tx);
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
    await bitfruitEx.sellFruits(order);
    // レスポンスを返す
    ctx.response.body = {};
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
  .get("/bitfruits", async (ctx: RouterContext) => {
    console.log("Req: bitfruits");
    const fruits = await bitfruitEx.getBitfruits();
    ctx.response.body = JSON.stringify(fruits);
  })
  .get("/bitfruits/:fid", async (ctx: RouterContext) => {
    const fid = ctx.params.fid;
    console.log(`Req: bitfruits/${fid}`);
    const fruits = await bitfruitEx.getBitfruits(parseInt(fid));
    ctx.response.body = JSON.stringify(fruits);
  })
  .get("/daily-access", async (ctx: RouterContext) => {
    console.log("Req: daily-access");
    const fruits = await bitfruitEx.getDailyAccess();
    ctx.response.body = JSON.stringify(fruits);
  });

const app = new Application();

app.use(oakCors());
app.use(router.routes());
// routerの設定を読み取り、許可するHTTPメソッドを自動設定
app.use(router.allowedMethods());

// 80 ポートで起動
const PORT = 80;
app.listen({ port: PORT });

const now = datetime().toZonedTime("Asia/Tokyo");
const nowStr = now.format("HH:mm MM/dd");
console.log(`🍌[${nowStr}] Started🍌`);
