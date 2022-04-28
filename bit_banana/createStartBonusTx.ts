// utils
import { buf2str } from "../utils/buf_base64.ts";

// blockchain
import { SenderSigContent } from "../blockchain/mod.ts";

/// トランザクションを作成
export async function createStartBonusTx(
  pvtKey: CryptoKey,
  myAddr: string,
  toAddr: string,
): Promise<SenderSigContent> {
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();
  // output を Json -> エンコード -> 署名
  const outputsJson = JSON.stringify("ここにContent");
  const encoder = new TextEncoder();
  const data = encoder.encode(outputsJson);
  const sigBuf = await crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32, // ダイジェストアルゴリズムにSHA256を選んだ時は32がおすすめらしい
    },
    pvtKey!,
    data,
  );
  const sig = buf2str(sigBuf);
  const con: SenderSigContent = {
    tx_id: "",
    tx_page: 0,
    tx_all_pages: 0,
    r_addr: "",
    amount: 0,
    fee: 0,
  };
  return con;
}
