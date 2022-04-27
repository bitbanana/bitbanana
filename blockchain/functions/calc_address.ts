//
//
//

// utils
import { base58 } from "../../utils/base58.ts";
import { sha256ary } from "../../utils/sha256.ts";

// 公開鍵からアドレスを作成
export async function calcAddress(pubKeyB64: string): Promise<string> {
  const hashAry = await sha256ary(pubKeyB64);
  return await base58(hashAry);
}

export async function addrIsValid(addr: string, pubKeyB64: string) {
  const correct = await calcAddress(pubKeyB64);
  return addr == correct;
}
