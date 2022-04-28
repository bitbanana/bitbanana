//
//
//

import { UserRepository } from "./user_repository.ts";
import { BitfruitRepository } from "./bitfruitRepository.ts";
import { User } from "./user.ts";
import { Bitfruit } from "./types/BitFruit.ts";
import { Wallet } from "../wallet/wallet.ts";
import {
  Block,
  createBlock as newBlock,
  SenderSigContent,
  Stake,
} from "../blockchain/mod.ts";
import { signature } from "../validator_node/signature.ts";
import { createStartBonusTx as startBonusTx } from "./create_start_bonus_tx.ts";
import { Follower } from "../full_node/follower.ts";
import { Bill } from "./types/Bill.ts";
import { WhiteBillRepo } from "./WhiteBillRepo.ts";

export class BitFruit implements Follower {
  wallet: Wallet;
  whiteBills: Bill[] = [];
  bitfruits: Bitfruit[] = [];

  constructor() {
    this.wallet = new Wallet(
      "./bit_fruit/keychain",
      "./bit_fruit/storage/key_value.json",
    );
  }

  async init(): Promise<void> {
    const bRepo = new BitfruitRepository();
    this.bitfruits = await bRepo.loadBitfruits();
    const wbRepo = new WhiteBillRepo();
    this.whiteBills = await wbRepo.loadWhiteBills();
  }

  onRedTx(contents: SenderSigContent[]): void {
    throw new Error("トランザクション拒否時の処理がありません");
  }

  onGreenTx(contents: SenderSigContent[]): void {
    const greenPo = this.whiteBills.filter((bo) =>
      bo.tx_id === contents[0].tx_id
    );
    if (greenPo.length > 1) {
      throw new Error("重複した購入注文が存在します");
    }
    if (greenPo.length === 1) {
      console.warn("[!] 支払いを確認しました 続きは未実装です");
    }
    console.warn("支払いに無関係のTxを受け取りました");
  }

  // ユーザー登録
  async createUser(userAddr: string): Promise<void> {
    const r = new UserRepository();
    let user: User | null = await r.getUser(userAddr);
    if (user != null) {
      console.log("すでに登録されているユーザーです");
      return;
    }
    user = { addr: userAddr, items: {} };
    await r.upsertUser(user);
  }

  // スタートボーナス用のTxを発行
  async createStartBonusTx(toAddr: string): Promise<SenderSigContent> {
    const tx = await startBonusTx(
      this.wallet.pvtKey!,
      this.wallet.address,
      toAddr,
    );
    return tx;
  }
  // バリデーターとしてブロックを作成
  async createBlock(
    prevBlock: Block,
    con: SenderSigContent,
    stake: Stake,
  ): Promise<Block> {
    const s = await signature(con.tx_id, this.wallet.pvtKey!);
    const block = await newBlock(
      prevBlock,
      con,
      "Adress",
      s,
      stake,
      "MySig",
    );
    return block;
  }

  // ユーザーがアイテムを購入
  async userBuyItem(
    userAddr: string,
    itemId: number,
    itemCount: number,
    txId: string,
  ): Promise<void> {
    const r = new UserRepository();
    const user = await r.getUser(userAddr);
    if (user == null) {
      console.log("登録されていないユーザーです");
      return;
    }
    const onePrice = await priceOfItem(itemId);
    const totalPrice = onePrice * itemCount;
    const count = user.items[itemId] ?? 0;
    // FIXME: - 入金を確認する
    user.items[itemId] = count + itemCount; // アイテムが増える
    await r.upsertUser(user);
  }

  // ユーザーがアイテムを売却
  async userSellItem(
    userAddr: string,
    itemId: number,
    itemCount: number,
    txId: string,
  ): Promise<void> {
    const r = new UserRepository();
    const user = await r.getUser(userAddr);
    if (user == null) {
      console.log("登録されていないユーザーです");
      return;
    }
    const onePrice = await priceOfItem(itemId);
    const totalPrice = onePrice * itemCount;
    const count = user.items[itemId] ?? 0;
    // FIXME: - 送金を確認する
    user.items[itemId] = count - itemCount; // アイテムが減る
    await r.upsertUser(user);
  }

  // アイテムの価格一覧を取得
  async getItemPrices(): Promise<any> {
    // FIXME: - 実装
    return {
      "0": 50,
      "1": 70,
      "2:": 30,
      "3": 25,
    };
  }
}

async function priceOfItem(itemId: number): Promise<number> {
  const price = await 5;
  return price;
}

function v(prevBlock: Block, tx: any, v: any) {
  throw new Error("Function not implemented.");
}

function tx(
  prevBlock: Block,
  tx: any,
  v: (prevBlock: Block, tx: any, v: any) => void,
) {
  throw new Error("Function not implemented.");
}

export const bitfruitServer = new BitFruit();
