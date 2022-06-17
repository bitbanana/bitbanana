//
//
//

import { FruitPocket } from "../types/FruitPocket.ts";
import { FruitPocketRepo } from "../FruitPocketRepo.ts";
import { startBonus as _startBonus } from "./startBonus.ts";
import { seeFruits as _seeFruits } from "./seeFruits.ts";

export async function seePockets(addr: string): Promise<FruitPocket[]> {
  const repo = new FruitPocketRepo();
  const pockets = await repo.loadPockets(addr);
  return pockets;
}
