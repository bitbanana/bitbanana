//
//
//

import { User } from "./user.ts";

export class UserRepository {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./bit_fruit/db/users.json";
  // 取得
  async getUser(addr: string): Promise<User | null> {
    const text = await Deno.readTextFile(this.filePath);
    const users: User[] = JSON.parse(text);
    const user = users.find((u) => u.addr == addr);
    if (user != null) {
      return user;
    } else {
      return null;
    }
  }
  // 作成/更新
  async upsertUser(user: User): Promise<void> {
    let text = await Deno.readTextFile(this.filePath);
    let users: User[] = JSON.parse(text);
    const oldUser = users.find((u) => u.addr == user.addr);
    if (user != null) {
      // すでに存在していた場合は削除
      users = users.filter((u) => u.addr != oldUser!.addr);
    }
    users.push(user);
    text = JSON.stringify(users, null, 2);
    // create: ファイルが存在しない場合は作成 = false
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}
