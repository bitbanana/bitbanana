//
//
//

// utils
import * as date_format from "../../utils/mod.ts";

// in-mod
import { Block } from "../types/Block.ts";

export function blockLog(b: Block): string {
  const str = `Block #${b.index}
  - time: ${date_format.timeReadable(b.time)}
  - tx_id: ${b.tx_id}`;
  return str;
}
