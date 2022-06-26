//
//
//

// bitbanana
import { Block, Stake, Tx } from "../../bitbanana/mod.ts";

// in-mod
import { FruitPocket } from "../types/FruitPocket.ts";
import { Bill } from "../types/Bill.ts";
import { SellOrder } from "../types/SellOrder.ts";
import { Bitfruit } from "../types/Bitfruit.ts";
import { BuyOrder } from "../types/BuyOrder.ts";
import { startBonus as _startBonus } from "../functions/startBonus.ts";
import { seeFruits as _seeFruits } from "../functions/seeFruits.ts";
import { seePockets as _seePockets } from "../functions/seePockets.ts";
import { buyFruits as _buyFruits } from "../functions/buyFruits.ts";
import { sellFruits as _sellFruits } from "../functions/sellFruits.ts";

/// IBitfruitEx
export interface IBitfruitEx {
  // 初期化
  init(): Promise<void>;

  // 初回限定ボーナスをもらう (実は残高0なら何度でももらえる)
  // 公開鍵をサーバーに登録する
  startBonus(addr: string): Promise<number>;

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

  // Validator createBlock
  createBlock(tx: Tx, prevBlock: Block, winnerStake: Stake): Promise<Block>;

  // Full-Node applyStake
  applyStake(stake: Stake): Promise<void>;

  // Full-Node balanceInquiry
  balanceInquiry(addr: string): Promise<number>;

  // Full-Node addWhiteTx
  addWhiteTx(tx: Tx): Promise<void>;
}
