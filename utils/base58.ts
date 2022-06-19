//
//
//

// deps
import { base58 as lib } from "../deps/deps.ts";

export async function base58(array: Uint8Array): Promise<string> {
  const str = await lib.encode(array);
  return str;
}
