import { updateBitfruits } from "../bitfruit_ex/mod.ts";

Deno.test("フルーツ更新テスト", async () => {
  await updateBitfruits();
  console.log("更新テストが完了しました");
});
