//
//
//

// mongo
import { Collection } from "../mongo/Collection.ts";

// others
import { DailyAccess } from "./types/DailyAccess.ts";

/// DailyAccessRepo
export class DailyAccessRepo {
  // 取得
  async getDailyAccessList(): Promise<DailyAccess[]> {
    const c = new Collection<DailyAccess>("dailyaccess");
    const list = await c.find({});
    return list;
  }
}
