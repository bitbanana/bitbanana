import { SenderSigContent } from "../../blockchain/mod.ts";
import { Tx } from "../../blockchain/types/Tx.ts";
import {
  bitfruitExAddr,
  bitfruitExTmpSig,
  startBonusAmount,
} from "../config/config.ts";

/// トランザクションを作成
export function createStartBonusTx(addr: string): Tx {
  const txId = crypto.randomUUID();
  const amount = startBonusAmount;
  const cont: SenderSigContent = {
    tx_id: txId,
    r_addr: addr,
    amount: amount,
    fee: 0,
  };
  const tx: Tx = {
    s_addr: bitfruitExAddr,
    s_sig_cont: cont,
    s_sig: bitfruitExTmpSig,
  };
  return tx;
}
