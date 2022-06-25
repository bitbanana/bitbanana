//
//
//

// core
import { Block, Stake, Tx, TxListener } from "../core/mod.ts";

// others
import { FruitPocket } from "./types/FruitPocket.ts";
import { Bill } from "./types/Bill.ts";
import { SellOrder } from "./types/SellOrder.ts";
import { Bitfruit } from "./types/Bitfruit.ts";
import { BuyOrder } from "./types/BuyOrder.ts";
import { createBitfruits } from "./functions/createBitfruits.ts";
import { startBonus as _startBonus } from "./functions/startBonus.ts";
import { seeFruits as _seeFruits } from "./functions/seeFruits.ts";
import { seePockets as _seePockets } from "./functions/seePockets.ts";
import { buyFruits as _buyFruits } from "./functions/buyFruits.ts";
import { sellFruits as _sellFruits } from "./functions/sellFruits.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";
import { BitfruitRepo } from "./BitfruitRepo.ts";
import { DailyAccessRepo } from "./DailyAccessRepo.ts";
import { Trader } from "./Trader.ts";
import { IBitfruitEx } from "./interfaces/IBitfruitEx.ts";
import { initFullNode } from "./full_node_tree/initFullNode.ts";
import { initValidator } from "./validator_tree/initValidator.ts";
import { bitfruitExAddr } from "./config/config.ts";

/// BitfruitEx
export class BitfruitEx implements IBitfruitEx, TxListener {
  fullNode = initFullNode();
  validator = initValidator();

  async init(): Promise<void> {
    await createBitfruits();
    // バリデーターとして応募する。URLはここでは特別にアドレスを使う
    await this.validator.apply(bitfruitExAddr);
    await this.fullNode.addTxListener(this);
  }

  /// impl IBitfruitEx
  async startBonus(addr: string): Promise<number> {
    const balance = await this.fullNode.balanceInquiry(addr);
    if (balance !== 0) {
      throw new Error("Already has balance");
    }
    const accessRepo = new DailyAccessRepo();
    return await _startBonus(accessRepo, this.fullNode, addr);
  }

  /// impl IBitfruitEx
  async seeFruits(): Promise<Bitfruit[]> {
    return await _seeFruits();
  }

  /// impl IBitfruitEx
  async seePockets(addr: string): Promise<FruitPocket[]> {
    return await _seePockets(addr);
  }

  /// impl IBitfruitEx
  async buyFruits(order: BuyOrder): Promise<Bill> {
    return await _buyFruits(order);
  }

  /// impl IBitfruitEx
  async sellFruits(order: SellOrder): Promise<void> {
    const tx = await _sellFruits(order);
    // ユーザーへ送金
    return await this.fullNode.addWhiteTx(tx);
  }

  /// impl IBitfruitEx
  async getBitfruits(fruit_id?: number): Promise<Bitfruit[]> {
    const repo = new BitfruitRepo();
    return await repo.getBitfruits(fruit_id);
  }

  /// impl IBitfruitEx
  async getDailyAccess(): Promise<DailyAccess[]> {
    const repo = new DailyAccessRepo();
    return await repo.getDailyAccessList();
  }

  // impl IBitfruitEx
  async createBlock(
    tx: Tx,
    prevBlock: Block,
    winnerStake: Stake,
  ): Promise<void> {
    await this.validator.createBlock(tx, prevBlock, winnerStake);
    return;
  }

  // impl IBitfruitEx
  async applyStake(stake: Stake): Promise<void> {
    await this.fullNode.addStake(stake);
  }

  // impl IBitfruitEx
  async balanceInquiry(addr: string): Promise<number> {
    return await this.fullNode.balanceInquiry(addr);
  }

  // impl IBitfruitEx
  async addWhiteTx(tx: Tx): Promise<void> {
    await this.fullNode.addWhiteTx(tx);
  }

  /// impl TxListener
  async onGreenTx(tx: Tx): Promise<void> {
    const billRepo = new WhiteBillRepo();
    const targetBills = await billRepo.loadWhiteBills(tx.s_sig_cont.tx_id);
    if (targetBills.length > 1) {
      // 支払い待ちの注文が複数見つかった
      throw new Error(
        `[!] 複数の注文 に 1つの支払い が紐づいています TxID: ${tx.s_sig_cont.tx_id}`,
      );
    }
    if (targetBills.length === 1) {
      // 支払い待ちの注文が一つ見つかった
      const bill = targetBills[0];
      // 未払いのBillから削除
      await billRepo.removeWhiteBill(bill);
      const trader = new Trader();
      // 購入された数を集計
      await trader.incBuyCount(bill);
      // 所有数を増やす
      await trader.incPocketCount(bill);
      return;
    }
    console.log("注文に紐づいていないTxをスルーします");
  }

  /// impl TxListener
  onRedTx(tx: Tx): void {
    // TODO: - 実装
    throw new Error("未実装です");
  }
}

export const bitfruitEx: IBitfruitEx = new BitfruitEx();
