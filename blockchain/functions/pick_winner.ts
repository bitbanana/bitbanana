//
//
//

// types
import { Stake } from "../types/stake.ts";

// 抽選プールを作って、ブロックを追加する権利があるwinnerを決める
// ステーク(預けておいた)されたトークンの量に応じて当選率が上がる
export function pickWinner(stakes: Stake[]): string {
  // 抽選の応募者がいない場合は終了
  if (stakes.length < 0) {
    console.log("バリデーターが不足しています");
    return "";
  }

  // 抽選箱
  const lotteryPool: string[] = [];
  // 全ての抽選者に対して
  for (let s of stakes) {
    // 応募金の数だけ抽選箱にアドレスを追加
    const range = Array.from(Array(s.token).keys()); // 0..length
    for (const _ of range) {
      lotteryPool.push(s.address);
    }
  }

  // 抽選箱からランダムに一つ取り出す
  const randomIndex = Math.floor(Math.random() * lotteryPool.length);
  return lotteryPool[randomIndex];
}
