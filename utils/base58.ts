import { base58 } from "../deps.ts";

export async function base58Of(array: Uint8Array): Promise<string> {
  const str = await base58.encode(array);
  return str;
}
