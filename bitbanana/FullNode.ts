//
//
//

// in-mod
import { IBlockchainRepo } from "./interfaces/IBlockchainRepo.ts";
import { IBalanceSnapshotRepo } from "./interfaces/IBalanceSnapshotRepo.ts";
import { IFullNode } from "./interfaces/IFullNode.ts";
import { TxListener } from "./interfaces/TxListener.ts";
import { createBlock } from "./functions/createBlock.ts";
import { pickWinner } from "./functions/pickWinner.ts";
import { balanceInquiry as _balanceInquiry } from "./functions/balanceInquiry.ts";
import { callCreateBlock } from "./functions/callCreateBlock.ts";
import { State } from "./types/State.ts";
import { Tx } from "./types/Tx.ts";
import { Stake } from "./types/Stake.ts";

/// FullNode
export class FullNode implements IFullNode {
  /// State
  state: State;
  /// addr
  addr: string;

  // constructor
  constructor(
    addr: string,
    private snapshotRepo: IBalanceSnapshotRepo,
    private blockchainRepo: IBlockchainRepo,
  ) {
    this.addr = addr;
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
    const block = await callCreateBlock(tx, prevBlock, winnerStake);
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
