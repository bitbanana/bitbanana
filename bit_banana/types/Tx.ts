import { SenderSigContent } from "../../blockchain/mod.ts";

export type Tx = {
  s_addr: string;
  pages: TxPage[];
};

export type TxPage = {
  cont: SenderSigContent;
  s_sig: string;
};
