import { SenderSigContent } from "../../blockchain/mod.ts";

export type Tx = {
  s_addr: string;
  s_sig_cont: SenderSigContent;
  s_sig: string;
};
