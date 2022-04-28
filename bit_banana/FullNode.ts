import { BitbananaWallet } from "./types/BitBananaWallet.ts";
import { BlockchainRepository } from "./BlockchainRepository.ts";

import { createWallet } from "./createWallet.ts";
import {
  Block,
  createBlock,
  pickWinner,
  SenderSigContent,
  Stake,
} from "../blockchain/mod.ts";
import { Tx } from "./types/Tx.ts";

export class FullNode {
  wallet: BitbananaWallet | null = null;
  whiteTxList: Tx[] = [];
  // 検証済みの全ブロック
  blockchain: Block[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [
    {
      addr: "Validator.V1.Free.Adrress",
      token: 1,
    },
  ];

  async init(): Promise<void> {
    this.wallet = await createWallet();
    const r = new BlockchainRepository();
    this.blockchain = await r.loadLocalBlockchain();
  }

  createStartBonusTx(addr: string, pubKey: string): SenderSigContent {
    const txId = crypto.randomUUID();
    const con: SenderSigContent = {
      tx_id: txId,
      tx_page: 1,
      tx_all_pages: 1,
      r_addr: addr,
      amount: 5000,
      fee: 0,
    };
    return con;
  }

  sSig(con: SenderSigContent): string {
    return "Coinbase.V1.Free.Sig";
  }

  vSig(con: SenderSigContent, sSig: string, v_token: number) {
    return "Validator.V1.Free.Sig";
  }

  async onReceiveWhiteTx(): Promise<void> {
    const tx = this.whiteTxList[this.whiteTxList.length - 1];
    const winnerStake = pickWinner(this.stakes);
    const prevBlock = this.blockchain[this.blockchain.length - 1];
    const vSig = this.vSig(tx.con, tx.sSig, winnerStake.token);
    const block = await createBlock(
      prevBlock,
      tx.con,
      tx.sAddr,
      tx.sSig,
      winnerStake,
      vSig,
    );
    this.blockchain.push(block);
    const r = new BlockchainRepository();
    r.saveLocalBlockchain(this.blockchain);
    this.notifyGreenTx(tx.con);
  }

  notifyGreenTx(content: SenderSigContent) {
    console.log("フォロワーにBlock追加成功を知らせます");
  }
}

export const fullNode = new FullNode();