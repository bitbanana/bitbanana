//
//
//

// utils
import { yyyyMMdd } from "../../utils/mod.ts";

// in-mod
import { Bitfruit } from "../types/Bitfruit.ts";
import { startBonus as _startBonus } from "./startBonus.ts";
import { BitfruitRepo } from "../BitfruitRepo.ts";

export async function seeFruits(): Promise<Bitfruit[]> {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  // 通信
  const fRepo = new BitfruitRepo();
  const fruits = await fRepo.loadFruitsByDate(todayYyyymmdd);
  return fruits;
}
