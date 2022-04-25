//
//
//

// types
import { Stake } from "../types/stake.ts";

// 抽選プールを作って、ブロックを追加する権利があるwinnerを決める
// ステーク(預けておいた)されたトークンの量に応じて当選率が上がる
export function pickWinner(stakes: Stake[]): Stake {
  // 抽選の応募者がいない場合は終了
  if (stakes.length < 0) {
    throw new Error("バリデーターが不足しています");
  }

  // 抽選箱
  const lotteryPool: Stake[] = [];
  // 全ての抽選者に対して
  for (const s of stakes) {
    // 応募金の数だけ抽選箱に追加
    const range = Array.from(Array(s.token).keys()); // 0..length
    for (const _ of range) {
      lotteryPool.push(s);
    }
  }

  // 抽選箱からランダムに一つ取り出す
  const randomIndex = Math.floor(Math.random() * lotteryPool.length);
  return lotteryPool[randomIndex];
}
