//
//
//

// utils
import * as base58 from "../utils/base58.ts";
import * as hash from "../utils/hash.ts";

// 公開鍵からアドレスを作成 Bitcoin形式 の超簡略バージョン
export async function calcAddress(pubKeyB64: string): Promise<string> {
  // hash
  const hashArray = await hash.hashOf(pubKeyB64);
  // base58
  const base58Str = await base58.base58Of(hashArray);
  return base58Str;
}

export async function addrIsValid(address: string, pubKeyB64: string) {
  const correct = await calcAddress(pubKeyB64);
  return address == correct;
}
