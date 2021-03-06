//
//
//

// in-mod
import { getBlockHash } from "./getBlockHash.ts";
import { Block } from "../types/Block.ts";
import { Stake } from "../types/Stake.ts";
import { SenderSigContent } from "../types/SenderSigContent.ts";

// 新しいブロックを生成
export async function createBlock(
  prevB: Block,
  content: SenderSigContent,
  sAddr: string,
  sSig: string,
  stake: Stake,
  vSig: string,
): Promise<Block> {
  const time = new Date().toISOString();
  const index = prevB.index + 1;

  const block: Block = {
    index: index,
    time: time,
    tx_id: content.tx_id,
    s_addr: sAddr,
    s_sig: sSig,
    r_addr: content.r_addr,
    amount: content.amount,
    fee: content.fee,
    v_addr: stake.addr,
    v_token: stake.token,
    v_sig: vSig,
    prev_hash: prevB.hash,
    hash: "",
  };
  block.hash = await getBlockHash(block);
  return block;
}
