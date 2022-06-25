// deno-lint-ignore-file require-await
//
//
//

// bitfruit_ex
import { bitfruitEx } from "../../bitfruit_ex/BitfruitEx.ts";

// in-mod
import { Stake } from "../types/Stake.ts";
import { bitfruitExAddr } from "../../bitfruit_ex/config/config.ts";

export async function callApplyStake(
  stake: Stake,
  // deno-lint-ignore no-unused-vars
  nodeUrl: string,
): Promise<void> {
  if (stake.addr == bitfruitExAddr) {
    // 通信を介さず Bitfruit の fullBode に直接追加する
    await bitfruitEx.applyStake(stake);
  }
  throw new Error("一般バリデータは現在応募できません");
}
