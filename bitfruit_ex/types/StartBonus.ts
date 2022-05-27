export type StartBonusReq = {
  addr: string;
  pub_jwk: number;
};

export type StartBonusRes = {
  new_balance: number;
};
