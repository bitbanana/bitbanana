//
//
//

// blockchain
import { createBlock, pickWinner, Tx } from "../blockchain/mod.ts";

// node1
import { node1 } from "../node1/mod.ts";

// other
import { BlockchainRepo } from "./BlockchainRepo.ts";
import { State } from "./State.ts";
import { balanceInquiry as _balanceInquiry } from "./functions/balanceInquiry.ts";

/// IFullNode
export interface IFullNode {
  // 残高照会 (全レコード参照)
  balanceInquiry(addr: string): Promise<number>;
  // 処理待ちの Tx を追加する
  // (WebSocket クライアント > サーバー)
  addWhiteTx(tx: Tx): Promise<void>;
}

/// FullNode
export class FullNode implements IFullNode {
  /// State
  state = new State();

  /// impl IFullNode
  async balanceInquiry(addr: string): Promise<number> {
    return await _balanceInquiry(addr);
  }

  /// impl IFullNode
  async addWhiteTx(tx: Tx): Promise<void> {
    this.state.whiteTxList.push(tx);
    const winnerStake = pickWinner(this.state.stakes);
    const blockRepo = new BlockchainRepo();
    const prevBlock = await blockRepo.getLastBlock();
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
    const r = new BlockchainRepo();
    await r.saveBlock(block);
    await this.notifyGreenTx(tx);
  }

  async notifyGreenTx(tx: Tx) {
    for await (const f of this.state.txListeners) {
      f.onGreenTx(tx);
    }
  }
}
