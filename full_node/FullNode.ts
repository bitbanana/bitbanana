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
import { Tx } from "./types/Tx.ts";
import { Follower } from "./follower.ts";
import { VERSION } from "../full_node/config.ts";

export class FullNode {
  whiteTxList: Tx[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [
    {
      addr: "@node1",
      token: 0,
    },
  ];
  followers: Follower[] = [];

  async init(): Promise<void> {}

  createStartBonusTx(addr: string): Tx {
    const txId = crypto.randomUUID();
    const cont: SenderSigContent = {
      tx_id: txId,
      r_addr: addr,
      amount: 5000,
      fee: 0,
    };
    const tx: Tx = {
      s_addr: "@node1",
      s_sig_cont: cont,
      s_sig: this.sSig(cont),
    };
    return tx;
  }

  sSig(con: SenderSigContent): string {
    return "@node1の適当な署名";
  }

  vSig(con: SenderSigContent, sSig: string, v_token: number) {
    return "@node1の適当な署名";
  }

  async onReceiveWhiteTx(): Promise<void> {
    console.log("onReceiveWhiteTx");
    const tx = this.whiteTxList[this.whiteTxList.length - 1];
    const winnerStake = pickWinner(this.stakes);
    const prevBlock = await getLastBlock();
    const vSig = this.vSig(tx.s_sig_cont, tx.s_sig, winnerStake.token);
    const block = await createBlock(
      prevBlock,
      tx.s_sig_cont,
      tx.s_addr,
      tx.s_sig,
      winnerStake,
      vSig,
    );
    console.log("onReceiveWhiteTx: Step2");
    const r = new BlockchainRepo();
    await r.saveBlock(block);
    await this.notifyGreenTx(tx);
  }

  async notifyGreenTx(tx: Tx) {
    for await (const f of this.followers) {
      await f.onGreenTx(tx);
    }
  }
}

export const fullNode = new FullNode();
