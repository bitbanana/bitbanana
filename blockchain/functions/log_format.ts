//
//
//

// utils
import * as date_format from "../../utils/date_format.ts";

// types
import { Block } from "../types/block.ts";

export function blockLog(b: Block): string {
  const str = `Block #${b.index}
  - time: ${date_format.timeReadable(b.time)}
  - tx.id: ${b.tx.id}`;
  return str;
}
