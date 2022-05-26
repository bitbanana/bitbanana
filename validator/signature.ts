// utils
import { buf2str } from "../utils/buf_base64.ts";

// Tx に対して署名する
export async function signature(
  txId: string,
  pvtKey: CryptoKey,
): Promise<string> {
  // Json -> エンコード -> 署名
  const json = JSON.stringify(txId);
  const encoder = new TextEncoder();
  const data = encoder.encode(json);
  const buf = await crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32, // ダイジェストアルゴリズムにSHA256を選んだ時は32がおすすめらしい
    },
    pvtKey,
    data,
  );
  const signature = buf2str(buf);
  return signature;
}
