//
//
//

import { yyyyMMdd } from "../../utils/date_format.ts";
import { Bitfruit } from "../types/Bitfruit.ts";
import { Collection } from "../../mongo/Collection.ts";
import { startBonus as _startBonus } from "./startBonus.ts";

export async function seeFruits(): Promise<Bitfruit[]> {
  const today = new Date();
  const todayYyyymmdd = yyyyMMdd(today);
  // 通信
  const c = new Collection<Bitfruit>("bitfruits");
  const fruits = await c.find({ "yyyymmdd": todayYyyymmdd });
  return fruits;
}
