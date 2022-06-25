//
//
//

// core
import { IFullNode } from "../../core/mod.ts";

// in-mod
import { DailyAccessRepo } from "../DailyAccessRepo.ts";
import { createStartBonusTx } from "./createStartBonusTx.ts";
import { startBonusAmount } from "../config/config.ts";

export async function startBonus(
  dailyAccessRepo: DailyAccessRepo,
  fullNode: IFullNode,
  addr: string,
): Promise<number> {
  const tx = createStartBonusTx(addr);
  await fullNode.addWhiteTx(tx);
  // アクセスログを残す
  await dailyAccessRepo.incrementStartBonusApi();
  const newBalance = startBonusAmount;
  return newBalance;
}
