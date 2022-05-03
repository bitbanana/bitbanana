//
//
//

import { DayFruit } from "./types/DayFruit.ts";

export class DayFruitRepo {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/dayfruits.json";
  // 取得
  async loadFruit(fruitId: number, yyyyMMdd: string): Promise<DayFruit> {
    const text = await Deno.readTextFile(this.filePath);
    const fruits: DayFruit[] = JSON.parse(text);
    const fruit = fruits.find((e) =>
      e.fruit_id === fruitId && e.yyyymmdd === yyyyMMdd
    );
    if (fruit === undefined) {
      throw new Error("DayFruitが見つかりません");
    }
    return fruit!;
  }
  // 日付を指定して取得
  async loadFruitsByDate(yyyyMMdd: string): Promise<DayFruit[]> {
    const text = await Deno.readTextFile(this.filePath);
    let fruits: DayFruit[] = JSON.parse(text);
    fruits = fruits.filter((e) => e.yyyymmdd === yyyyMMdd);
    if (fruits.length === 0) {
      console.log("現在のDayFruitsが 0件 でした");
    }
    return fruits;
  }
  // 作成/更新
  async updateFruit(fruit: DayFruit): Promise<void> {
    let text = await Deno.readTextFile(this.filePath);
    let fruits: DayFruit[] = JSON.parse(text);
    // 該当のレコードを削除
    fruits = fruits.filter((e) =>
      e.fruit_id !== fruit.fruit_id || e.yyyymmdd !== fruit.yyyymmdd
    );
    // 追加
    fruits.push(fruit);
    text = JSON.stringify(fruits, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }

  // 作成/更新
  async saveFruits(fruits: DayFruit[]): Promise<void> {
    let text = await Deno.readTextFile(this.filePath);
    const allFruits: DayFruit[] = JSON.parse(text);
    for (const f of fruits) {
      fruits.push(f);
    }
    text = JSON.stringify(allFruits, null, 2);
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}