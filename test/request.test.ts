export async function testSendReq() {
  const res = await fetch("http://localhost:8000/test", {
    method: "GET",
  });
  const text = await res.text();
}

Deno.test("GETリクエスト送信", async () => {
  await testSendReq();
});
