//
//
//

// utils
import { MongoCollection, yyyyMMdd } from "../utils/mod.ts";

// in-mod
import { DailyAccess } from "./types/DailyAccess.ts";

/// DailyAccessRepo
export class DailyAccessRepo {
  collection = new MongoCollection<DailyAccess>("dailyaccess");
  // 取得
  async getDailyAccessList(): Promise<DailyAccess[]> {
    const list = await this.collection.find({});
    return list;
  }

  // 更新
  async incrementStartBonusApi(): Promise<void> {
    const today = yyyyMMdd(new Date());
    await this.collection.increment({ yyyymmdd: today }, "api_start_bonus");
  }
}
