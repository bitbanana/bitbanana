import { Stake } from "../blockchain/mod.ts";
import { Tx } from "../blockchain/types/Tx.ts";
import { Follower } from "./Follower.ts";

class State {
  whiteTxList: Tx[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [];
  followers: Follower[] = [];
}

export const state = new State();
