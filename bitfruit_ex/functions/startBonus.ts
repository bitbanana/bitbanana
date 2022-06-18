//
//
//

// node1
import { node1 } from "../../node1/mod.ts";

// in-mod
import { DailyAccessRepo } from "../DailyAccessRepo.ts";
import { createStartBonusTx } from "./createStartBonusTx.ts";
import { startBonusAmount } from "../config/config.ts";
import { StartBonusRes } from "../types/StartBonus.ts";

export async function startBonus(addr: string): Promise<StartBonusRes> {
  const balance = await node1.fullNode.balanceInquiry(addr);
  if (balance !== 0) {
    throw new Error("Already has balance");
  }
  const tx = createStartBonusTx(addr);
  await node1.fullNode.addWhiteTx(tx);

  const accessRepo = new DailyAccessRepo();
  await accessRepo.incrementStartBonusApi();

  const newBalance = startBonusAmount;
  const req: StartBonusRes = {
    new_balance: newBalance,
  };
  return req;
}
