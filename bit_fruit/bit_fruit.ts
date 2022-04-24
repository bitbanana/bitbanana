//
//
//

import { UserRepository } from "./user_repository.ts";
import { User } from "./user.ts";

export class BitFruit {
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
