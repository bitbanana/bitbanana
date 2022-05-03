import { Collection } from "./Collection.ts";

export async function test() {
  try {
    const c = new Collection<{ test: string }>("blockchain");
    await c.insertOne({ test: "1" });
    await c.insertMany([{ test: "1_1" }, { test: "1_2" }]);
    const found = await c.find({ "test": "1_1" });
    console.log(found);
    await c.replaceOne({ "test": "1_2" }, { "test": "1_2s" });
    // await c.deleteMany({});

    //     response.status = 201;
    //     response.body = {
    //       success: true,
    //       data: "ここにレスポンスボディ",
    //       insertedId,
    //     };
  } catch (err) {
    console.log(err.toString());
    //     response.status = 400;
    //     response.body = {
    //       success: false,
    //       msg: err.toString(),
    //     };
  }
}

await test();

// obj は id を持っている
//
// create 作る => アプリ
// insert 新規保存
//   query: obj
// find 見つけ出す
//   query: filter
//   result: obj
// modify 編集 => アプリ
// update 変更して保存
//   query: filter, param
// put 置き換えて保存
//   query: obj
// remove 削除
//   query: filter
