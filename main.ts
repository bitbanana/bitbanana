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
} from "./deps/deps.ts";
import { env } from "./deps/env.ts";

// core
import { Tx } from "./core/mod.ts";

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
const VERSION = "0.9.0";

// インスタンス初期化
await node1.init(); // FullNode
await bitfruitEx.init(); // BitfruitEx

// リクエストからjsonパラメータを取り出す
async function getReqJson<T>(ctx: RouterContext): Promise<T> {
  const body = await ctx.request.body().value;
  const string = JSON.stringify(body);
  const json: T = JSON.parse(string);
  return json;
}

// Routing
const router = new Router();
router
  .get("/", (ctx: RouterContext) => {
    console.log("Req: API ROOT");
    ctx.response.body = `Hello Bit Banana! ${VERSION}`;
  })
  .post("/start-bonus", async (ctx: RouterContext) => {
    console.log("Req: start-bonus");
    const req = await getReqJson<{ addr: string }>(ctx);
    const newBalance = await bitfruitEx.startBonus(req.addr);
    ctx.response.body = { new_balance: newBalance };
  })
  .post("/balance-inquiry", async (ctx: RouterContext) => {
    console.log("Req: balance-inquiry");
    const req = await getReqJson<{ addr: string }>(ctx);
    const balance = await node1.fullNode.balanceInquiry(req.addr);
    ctx.response.body = { balance: balance };
  })
  .post("/see-fruits", async (ctx: RouterContext) => {
    console.log("Req: see-fruits");
    const fruits = await bitfruitEx.seeFruits();
    ctx.response.body = { fruits: fruits };
  })
  .post("/see-pockets", async (ctx: RouterContext) => {
    console.log("Req: see-pockets");
    const req = await getReqJson<{ addr: string }>(ctx);
    const pockets = await bitfruitEx.seePockets(req.addr);
    ctx.response.body = { pockets: pockets };
  })
  .post("/buy-fruits", async (ctx: RouterContext) => {
    console.log("Req: buy-fruits");
    const order = await getReqJson<BuyOrder>(ctx);
    const bill = await bitfruitEx.buyFruits(order);
    ctx.response.body = { bill: bill };
  })
  .post("/add-white-tx-bitfruit", async (ctx: RouterContext) => {
    console.log("Req: add-white-tx-bitfruit");
    const tx = await getReqJson<Tx>(ctx);
    // 宛先がビットフルーツであることを確認
    if (tx.s_sig_cont.r_addr !== bitfruitExAddr) {
      ctx.response.body = { message: "宛先が不正です" };
      return;
    }
    await node1.fullNode.addWhiteTx(tx);
    ctx.response.body = {};
  })
  .post("/sell-fruits", async (ctx: RouterContext) => {
    console.log("Req: sell-fruits");
    const order = await getReqJson<SellOrder>(ctx);
    await bitfruitEx.sellFruits(order);
    ctx.response.body = {};
  })
  .post("/create-bitfruits", async (ctx: RouterContext) => {
    console.log("Req: create-bitfruits");
    const req = await getReqJson<{ api_key: string }>(ctx);
    const API_KEY = Deno.env.get("CRON_API_KEY");
    if (req.api_key !== API_KEY) {
      ctx.response.body = { message: "不正なAPIKeyです" };
      return;
    }
    await createBitfruits();
    ctx.response.body = { message: "CREATE を実施しました" };
  })
  .post("/update-bitfruits", async (ctx: RouterContext) => {
    console.log("Req: update-bitfruits");
    const req = await getReqJson<{ api_key: string }>(ctx);
    const API_KEY = Deno.env.get("CRON_API_KEY");
    if (req.api_key !== API_KEY) {
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
    const fid = parseInt(ctx.params.fid);
    console.log(`Req: bitfruits/${fid}`);
    const fruits = await bitfruitEx.getBitfruits(fid);
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
console.log(`🍌[${nowStr}] Started by FLAVOR: ${env.FLAVOR}`);
