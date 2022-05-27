// utils
import { buf2str } from "../utils/buf_base64.ts";

// blockchain
import { SenderSigContent } from "../blockchain/mod.ts";

import { Tx } from "../blockchain/types/Tx.ts";

/// トランザクションを作成
export function createStartBonusTx(addr: string): Tx {
  const txId = crypto.randomUUID();
  const cont: SenderSigContent = {
    tx_id: txId,
    r_addr: addr,
    amount: 5000,
    fee: 0,
  };
  const tx: Tx = {
    s_addr: "@node1",
    s_sig_cont: cont,
    s_sig: "@node1.tmp.sig",
  };
  return tx;
}
