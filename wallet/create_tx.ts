// utils
import { buf2str } from "../utils/buf_base64.ts";

// blockchain
import { SenderSigContent } from "../blockchain/mod.ts";

/// トランザクションを作成
async function createTx(
  pvtKey: CryptoKey,
  myAddr: string,
): Promise<SenderSigContent> {
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();
  // output を Json -> エンコード -> 署名
  const outputsJson = "ここには完成したsSigCntentが入ります";
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

  const cont: SenderSigContent = {
    tx_id: txId,
    r_addr: "これは私のアドレスです",
    amount: 0,
    fee: 0,
  };
  return cont;
}
