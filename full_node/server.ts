import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import type { RouterContext as XContext } from "https://deno.land/x/oak/mod.ts";
type RouterContext = XContext<any, any, any>;

const router = new Router();
router
  .get("/", (ctx: RouterContext) => {
    ctx.response.body = "Hello Bit Banana!";
  })
  .get("/json", (ctx: RouterContext) => {
    ctx.response.body = { status: "ok" };
  })
  .get("/json/:id", (ctx: RouterContext) => {
    ctx.response.body = {
      status: "ok",
      id: ctx.params.id,
    };
  })
  .post("/create-user", async (ctx: RouterContext) => {
    const body = await ctx.request.body().value;
    const string = JSON.stringify(body);
    const json = JSON.parse(string);
    console.log(json["nickname"]);
    ctx.response.body = {
      status: json["nickname"],
    };
  });

const app = new Application();

app.use(router.routes());
// routerの設定を読み取り、許可するHTTPメソッドを自動設定
app.use(router.allowedMethods());

// 8000 ポートで起動
const PORT = 8000;
app.listen({ port: PORT });
console.log(`Full-Node: Listening at PORT ${PORT}...`);
