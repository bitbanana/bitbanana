//
//
//

import { yyyyMMdd } from "../../utils/date_format.ts";
import { DailyAccess } from "../types/DailyAccess.ts";
import { Collection } from "../../mongo/Collection.ts";
import { createStartBonusTx } from "./createStartBonusTx.ts";
import { startBonusAmount } from "../config/config.ts";
import { StartBonusRes } from "../types/StartBonus.ts";
import { node1 } from "../../node1/Node1.ts";

export async function startBonus(addr: string): Promise<StartBonusRes> {
  const balance = await node1.fullNode.balanceInquiry(addr);
  if (balance !== 0) {
    throw new Error("Already has balance");
  }
  const tx = createStartBonusTx(addr);
  await node1.fullNode.addWhiteTx(tx);
  const today = yyyyMMdd(new Date());
  const c = new Collection<DailyAccess>("dailyaccess");
  await c.increment({ yyyymmdd: today }, "api_start_bonus");
  const newBalance = startBonusAmount;
  const req: StartBonusRes = {
    new_balance: newBalance,
  };
  return req;
}
