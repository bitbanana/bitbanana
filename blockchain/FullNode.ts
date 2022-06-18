//
//
//

// node1
import { node1 } from "../node1/mod.ts";

// in-mod
import { IBlockchainRepo } from "./interfaces/IBlockchainRepo.ts";
import { IBalanceSnapshotRepo } from "./interfaces/IBalanceSnapshotRepo.ts";
import { balanceInquiry as _balanceInquiry } from "./functions/balanceInquiry.ts";
import { IFullNode } from "./interfaces/IFullNode.ts";
import { createBlock, pickWinner, State, Tx } from "../blockchain/mod.ts";
import { Stake } from "./types/Stake.ts";
import { TxListener } from "./interfaces/TxListener.ts";

/// FullNode
export class FullNode implements IFullNode {
  /// State
  state: State;

  // constructor
  constructor(
    private snapshotRepo: IBalanceSnapshotRepo,
    private blockchainRepo: IBlockchainRepo,
  ) {
    this.state = {
      whiteTxList: [],
      stakes: [],
      txListeners: [],
    };
  }

  /// impl IFullNode
  async balanceInquiry(addr: string): Promise<number> {
    return await _balanceInquiry(this.blockchainRepo, this.snapshotRepo, addr);
  }

  /// impl IFullNode
  async addWhiteTx(tx: Tx): Promise<void> {
    this.state.whiteTxList.push(tx);
    const winnerStake = pickWinner(this.state.stakes);
    const prevBlock = await this.blockchainRepo.getLastBlock();
    // MEMO: - 現在バリデーターは node1 しかいないので、直接依存する
    // --- --- BIGIN Validator work --- ---
    const vSig = node1.sig;
    const block = await createBlock(
      prevBlock,
      tx.s_sig_cont,
      tx.s_addr,
      tx.s_sig,
      winnerStake,
      vSig,
    );
    // --- --- END Validator work --- ---
    await this.blockchainRepo.saveBlock(block);
    await this.notifyGreenTx(tx);
  }

  /// impl IFullNode
  addStake(stake: Stake): void {
    this.state.stakes.push(stake);
  }

  /// impl IFullNode
  addTxListener(listener: TxListener): Promise<void> {
    this.state.txListeners.push(listener);
    return Promise.resolve();
  }

  async notifyGreenTx(tx: Tx) {
    for await (const f of this.state.txListeners) {
      f.onGreenTx(tx);
    }
  }
}
