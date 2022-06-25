//
//
//

// in-mod
import { SenderSigContent } from "./SenderSigContent.ts";

/// Tx
export type Tx = {
  s_addr: string;
  s_sig_cont: SenderSigContent;
  s_sig: string;
};
