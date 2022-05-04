import { BitbananaWallet } from "./types/BitbananaWallet.ts";
import { BlockchainRepository } from "./BlockchainRepository.ts";
import { BitbananaWalletRepository } from "./BitbananaWalletRepository.ts";

import { createWallet } from "./createWallet.ts";
import {
  Block,
  createBlock,
  pickWinner,
  SenderSigContent,
  Stake,
} from "../blockchain/mod.ts";
import { Tx, TxPage } from "./types/Tx.ts";

export class FullNode {
  wallet: BitbananaWallet | null = null;
  whiteTxList: Tx[] = [];
  // 検証済みの全ブロック
  blockchain: Block[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [
    {
      addr: "Validator.V1.Free.Addr",
      token: 1,
    },
  ];

  async init(): Promise<void> {
    // Walletの読み込み
    const wRepo = new BitbananaWalletRepository();
    this.wallet = await wRepo.loadWallet();
    if (this.wallet == null) {
      console.log("Walletファイルが存在しません V1用に作成します");
      const now = new Date().toISOString();
      const v1Wallet: BitbananaWallet = {
        addr: "Coinbase.V1.Free.Addr",
        jwk: "Coinbase.V1.JWK",
        balance_memo: 0,
        nickname: " My Wallet",
        created_at: now,
        version: "0.0.1",
      };
      this.wallet = v1Wallet;

      // ブロックチェーンの読み込み
      const bcRepo = new BlockchainRepository();
      this.blockchain = await bcRepo.loadLocalBlockchain();
    }
  }

  createStartBonusTx(addr: string): Tx {
    const txId = crypto.randomUUID();
    const cont: SenderSigContent = {
      tx_id: txId,
      tx_page: 1,
      tx_all_pages: 1,
      r_addr: addr,
      amount: 5000,
      fee: 0,
    };
    const txPage: TxPage = {
      cont: cont,
      s_sig: this.sSig(cont),
    };
    const tx: Tx = {
      s_addr: "Coinbase.V1.Free.Addr",
      pages: [txPage],
    };
    return tx;
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
    if (tx.pages.length > 1) {
      throw new Error("複数ページのTxは未対応です");
    }
    const page = tx.pages[0];
    if (page.cont.tx_all_pages !== 1 || page.cont.tx_page !== 1) {
      throw new Error("1ページ目以外のTxは未対応です");
    }
    const vSig = this.vSig(page.cont, page.s_sig, winnerStake.token);
    const block = await createBlock(
      prevBlock,
      page.cont,
      tx.s_addr,
      page.s_sig,
      winnerStake,
      vSig,
    );
    this.blockchain.push(block);
    const r = new BlockchainRepository();
    await r.saveLocalBlockchain(this.blockchain);
    this.notifyGreenTx(tx);
  }

  notifyGreenTx(tx: Tx) {
    console.log("フォロワーにBlock追加成功を知らせます");
  }
}

export const fullNode = new FullNode();
