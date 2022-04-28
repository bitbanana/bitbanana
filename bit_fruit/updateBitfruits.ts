import { Bitfruit } from "./types/BitFruit.ts";

// 6時間ごとに実行される
export function updateBitfruits(): Bitfruit[] {
  const dammy: Bitfruit = {
    id: 0,
    nickname: "Dammy.Fruit",
    price: 120,
    priceRatioYtd: 5,
  };
  return [dammy];
}
