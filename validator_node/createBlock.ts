import {
  Block,
  createBlock as newBlock,
  SenderSigContent,
  Stake,
} from "../blockchain/mod.ts";

export async function createBlock(
  prevBlock: Block,
  con: SenderSigContent,
  sAddr: string,
  sSig: string,
  stake: Stake,
): Promise<Block> {
  const vSig = "これは私の署名です";
  const block = await newBlock(prevBlock, con, sAddr, sSig, stake, vSig);
  return block;
}
