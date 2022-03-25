//
//
//

import { UserRepository } from "./user_repository.ts";
import { User } from "./user.ts";

export class FruitServer {
  // ユーザー登録
  async createUser(userAddr: string, banana: number): Promise<void> {
    const r = new UserRepository();
    let user: User | null = await r.getUser(userAddr);
    if (user != null) {
      console.log("すでに登録されているユーザーです");
      return;
    }
    user = { addr: userAddr, banana: banana, items: {} };
    await r.upsertUser(user);
  }
  // ユーザーがアイテムを購入
  async userBuyItem(
    userAddr: string,
    itemId: number,
    itemCount: number,
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
    // FIXME: - バリデーション
    user!.banana -= totalPrice; // バナナが減って
    user.items[itemId] = count + itemCount; // アイテムが増える
    await r.upsertUser(user);
  }

  // ユーザーがアイテムを売却
  async userSellItem(
    userAddr: string,
    itemId: number,
    itemCount: number,
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
    user!.banana += totalPrice; // バナナが増えて
    user.items[itemId] = count - itemCount; // アイテムが減る
    await r.upsertUser(user);
  }
}

async function priceOfItem(itemId: number): Promise<number> {
  const price = await 5;
  return price;
}
