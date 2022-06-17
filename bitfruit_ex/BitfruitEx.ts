//
//
//

// blockchain
import { Tx } from "../blockchain/mod.ts";

// full_node
import { TxListener } from "../full_node/mod.ts";

// node1
import { node1 } from "../node1/mod.ts";

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
import { StartBonusRes } from "./types/StartBonus.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";
import { BitfruitRepo } from "./BitfruitRepo.ts";
import { DailyAccessRepo } from "./DailyAccessRepo.ts";
import { Trader } from "./Trader.ts";

/// IBitfruitEx
export interface IBitfruitEx {
  // 初回限定ボーナスをもらう (実は残高0なら何度でももらえる)
  // 公開鍵をサーバーに登録する
  startBonus(addr: string): Promise<StartBonusRes>;

  // ビットフルーツ一覧を見る
  seeFruits(): Promise<Bitfruit[]>;

  // 所有数を確認
  seePockets(addr: string): Promise<FruitPocket[]>;

  // ビットフルーツの購入注文
  buyFruits(order: BuyOrder): Promise<Bill>;

  // ビットフルーツを売却注文
  sellFruits(order: SellOrder): Promise<void>;

  // 価格推移をみる
  getBitfruits(fruit_id?: number): Promise<Bitfruit[]>;

  // アクセス数を見る
  getDailyAccess(): Promise<DailyAccess[]>;
}

/// BitfruitEx
export class BitfruitEx implements IBitfruitEx, TxListener {
  async init(): Promise<void> {
    await createBitfruits();
    node1.fullNode.state.txListeners.push(this);
  }

  /// impl IBitfruitEx
  async startBonus(addr: string): Promise<StartBonusRes> {
    return await _startBonus(addr);
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
    return await _sellFruits(order);
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

export const bitfruitEx = new BitfruitEx();
