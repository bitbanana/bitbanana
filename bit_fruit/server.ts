import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { Cron } from "https://cdn.jsdelivr.net/gh/hexagon/croner@4/src/croner.js";

const addr = "localhost:8000";
const baseUrl = `http://${addr}`;
console.log(`Bit Fruit Listening on ${baseUrl}`);

serve((req: Request) => {
  console.log("リクエストを受け取りました");
  if (req.method === "GET" && req.url === `${baseUrl}/test`) {
    return new Response('{ "result": "OK" }');
  } else {
    return new Response('{ "result": "NG 存在しないURL" }');
  }
}, { addr });

// 毎日 0,6,12,18時に実行
const _ = new Cron("0 0 0,6,12,18 * * *", {
  timezone: "Asia/Tokyo",
}, () => {
  console.log("価格を更新します");
});
