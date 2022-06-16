import { BitbananaWallet } from "./types/BitbananaWallet.ts";
import { BlockchainRepo } from "./BlockchainRepo.ts";
import { getLastBlock } from "./getLastBlock.ts";
import {
  Block,
  createBlock,
  pickWinner,
  SenderSigContent,
  Stake,
} from "../blockchain/mod.ts";
import { Tx } from "../blockchain/types/Tx.ts";
import { Follower } from "./Follower.ts";
import { VERSION } from "../full_node/config.ts";
import { state } from "./State.ts";
import { node1 } from "../node1/Node1.ts";

export async function onReceiveWhiteTx(): Promise<void> {
  const tx = state.whiteTxList[state.whiteTxList.length - 1];
  const winnerStake = pickWinner(state.stakes);
  const prevBlock = await getLastBlock();
  // MEMO: - 現在バリデーターは node1 しかいないので、直接依存する
  const vSig = node1.sig;
  const block = await createBlock(
    prevBlock,
    tx.s_sig_cont,
    tx.s_addr,
    tx.s_sig,
    winnerStake,
    vSig,
  );
  const r = new BlockchainRepo();
  await r.saveBlock(block);
  await notifyGreenTx(tx);
}

async function notifyGreenTx(tx: Tx) {
  for await (const f of state.followers) {
    await f.onGreenTx(tx);
  }
}
