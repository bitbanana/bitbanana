import { SenderSigContent } from "../../blockchain/mod.ts";

export type Tx = {
  sAddr: string;
  // FIXME: - pages: TxPage[] へ変更する
  con: SenderSigContent;
  sSig: string;
};

export type TxPage = {
  con: SenderSigContent;
  s_sig: string;
};
