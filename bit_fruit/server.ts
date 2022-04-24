import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const addr = "localhost:8000";
const baseUrl = `http://${addr}`;
console.log(`Bit Fruit Listening on ${baseUrl}`);

serve((req: Request) => {
  console.log("リクエストを受け取りました");
  if (req.method === "GET" && req.url === `${baseUrl}/test`) {
    return new Response(`ここは /testです`);
  } else {
    return new Response(`存在しないURLです ${req.url}`);
  }
}, { addr });
