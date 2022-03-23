//
//
//

// utils
import * as hash from "../utils/hash.ts";

// types
import { Tx } from "./types/tx.ts";
import { Validator } from "./types/validator.ts";

// Transaction -> string
function strOfTx(tx: Tx): string {
  const str = JSON.stringify(tx);
  console.log("tx json: ${str}");
  return str;
}

// Validator -> string
function strOfValidator(v: Validator): string {
  const str = JSON.stringify(v);
  return str;
}

// ブロックのハッシュを計算する
export async function calcBlockHash(
  index: number,
  time: string,
  prevHash: string,
  tx: Tx,
  validator: Validator,
): Promise<string> {
  // 順番は必ず守ること
  const str = index.toString() +
    time +
    prevHash +
    strOfTx(tx) +
    strOfValidator(validator);
  const hexHash = await hash.hexHashOf(str);
  return hexHash;
}
