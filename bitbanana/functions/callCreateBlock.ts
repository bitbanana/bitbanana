// deno-lint-ignore-file require-await
//
//
//

// bitfruit_ex
import { bitfruitEx } from "../../bitfruit_ex/BitfruitEx.ts";

// in-mod
import { Block } from "../types/Block.ts";
import { Stake } from "../types/Stake.ts";
import { Tx } from "../types/Tx.ts";
import { bitfruitExAddr } from "../../bitfruit_ex/config/config.ts";

export async function callCreateBlock(
  tx: Tx,
  prevBlock: Block,
  winnerStake: Stake,
): Promise<Block> {
  if (winnerStake.addr == bitfruitExAddr) {
    // 通信を介さず Bitfruit のバリデーターの createBlock を直接呼び出す
    await bitfruitEx.createBlock(tx, prevBlock, winnerStake);
  }
  throw new Error("一般バリデータは現在募集されていません");
}
