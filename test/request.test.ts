export async function sendGetReq() {
  const res = await fetch("http://localhost:8000/test", {
    method: "GET",
  });
  const text = await res.text();
}

export async function sendPostReq() {
  const res = await fetch("http://localhost:8000/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nickname: "taro" }),
  });
  const text = await res.text();
}

Deno.test("GETリクエスト送信", async () => {
  await sendGetReq();
});

Deno.test("POSTリクエスト送信", async () => {
  await sendPostReq();
});
