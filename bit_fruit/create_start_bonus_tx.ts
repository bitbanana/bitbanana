// utils
import { buf2str } from "../utils/buf_base64.ts";

// blockchain
import { Input, Output, Tx } from "../blockchain/mod.ts";

/// トランザクションを作成
export async function createStartBonusTx(
  pvtKey: CryptoKey,
  myAddr: string,
  toAddr: string,
): Promise<Tx> {
  const txId = crypto.randomUUID();
  const now = new Date().toISOString();
  const outputs: Output[] = [
    {
      to: toAddr,
      amount: 500,
      fee: 0,
    },
  ];
  // output を Json -> エンコード -> 署名
  const outputsJson = JSON.stringify(outputs);
  const encoder = new TextEncoder();
  const data = encoder.encode(outputsJson);
  const signatureBuf = await crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32, // ダイジェストアルゴリズムにSHA256を選んだ時は32がおすすめらしい
    },
    pvtKey!,
    data,
  );
  const signature = buf2str(signatureBuf);
  const inputs: Input[] = [
    {
      time: now,
      from: myAddr,
      signature: signature,
    },
  ];
  const tx: Tx = {
    id: txId,
    inputs: inputs,
    outputs: outputs,
  };
  return tx;
}
