//
//
//

import { UserRepository } from "./user_repository.ts";
import { User } from "./user.ts";
import { Wallet } from "../wallet/wallet.ts";
import {
  Block,
  createBlock as newBlock,
  Stake,
  Tx,
  Validator,
} from "../blockchain/mod.ts";
import { signature } from "../validator_node/signature.ts";
import { createStartBonusTx as startBonusTx } from "./create_start_bonus_tx.ts";
import { Follower } from "../full_node/follower.ts";
import { PurchaceOrder } from "./types/purchace_order.ts";

const whitePoList: PurchaceOrder[] = [];

export class BitFruit implements Follower {
  wallet: Wallet;

  constructor() {
    this.wallet = new Wallet(
      "./bit_fruit/keychain",
      "./bit_fruit/storage/key_value.json",
    );
    this.wallet.initialize();
  }

  onRedTx(tx: Tx): void {
    throw new Error("トランザクション拒否時の処理がありません");
  }

  onGreenTx(tx: Tx): void {
    const greenPo = whitePoList.filter((po) => po.id === tx.id);
    if (greenPo.length > 1) {
      throw new Error("重複した支払い請求が存在します");
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
  async createStartBonusTx(toAddr: string): Promise<Tx> {
    const tx = await startBonusTx(
      this.wallet.pvtKey!,
      this.wallet.address,
      toAddr,
    );
    return tx;
  }
  // バリデーターとしてブロックを作成
  async createBlock(prevBlock: Block, tx: Tx, stake: Stake): Promise<Block> {
    const s = await signature(tx.id, this.wallet.pvtKey!);
    const v: Validator = {
      address: stake.address,
      signature: s,
      token: stake.token,
    };
    const block = await newBlock(prevBlock, tx, v);
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
