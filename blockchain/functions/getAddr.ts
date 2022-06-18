//
//
//

// utils
import { base58, sha256ary } from "../../utils/mod.ts";

// 公開鍵からアドレスを作成
export async function getAddr(pubKeyB64: string): Promise<string> {
  const hashAry = await sha256ary(pubKeyB64);
  return await base58(hashAry);
}

export async function addrIsValid(addr: string, pubKeyB64: string) {
  const correct = await getAddr(pubKeyB64);
  return addr == correct;
}
