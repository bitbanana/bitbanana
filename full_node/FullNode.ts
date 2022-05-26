import { BitbananaWallet } from "./types/BitbananaWallet.ts";
import { BlockchainRepo } from "./BlockchainRepo.ts";
import { BitbananaWalletRepo } from "./BitbananaWalletRepo.ts";
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
  wallet: BitbananaWallet | null = null;
  whiteTxList: Tx[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [
    {
      addr: "Validator.V1.Free.Addr",
      token: 1,
    },
  ];
  followers: Follower[] = [];

  async init(): Promise<void> {
    // Walletの読み込み
    const wRepo = new BitbananaWalletRepo();
    this.wallet = await wRepo.loadWallet();
    if (this.wallet == null) {
      console.log("Walletファイルが存在しません V1用に作成します");
      const now = new Date().toISOString();
      const v1Wallet: BitbananaWallet = {
        addr: "FullNode.V1.Free.Addr",
        jwk: "Coinbase.V1.JWK",
        balance_memo: 0,
        nickname: " My Wallet",
        created_at: now,
        version: VERSION,
      };
      this.wallet = v1Wallet;
    }
  }

  createStartBonusTx(addr: string): Tx {
    const txId = crypto.randomUUID();
    const cont: SenderSigContent = {
      tx_id: txId,
      r_addr: addr,
      amount: 5000,
      fee: 0,
    };
    const tx: Tx = {
      s_addr: "FullNode.V1.Free.Addr",
      s_sig_cont: cont,
      s_sig: this.sSig(cont),
    };
    return tx;
  }

  sSig(con: SenderSigContent): string {
    return "FullNode.V1.Free.Sig";
  }

  vSig(con: SenderSigContent, sSig: string, v_token: number) {
    return "Validator.V1.Free.Sig";
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
