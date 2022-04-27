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
  - tx_id: ${b.tx_id}
  - tx_page: ${b.tx_page}/${b.tx_all_pages}`;
  return str;
}
