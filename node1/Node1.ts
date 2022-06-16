import { state } from "../full_node/State.ts";

class Node1 {
  addr = "@node1";
  sig = "@node1.tmp.sig";

  // deno-lint-ignore require-await
  async init(): Promise<void> {
    // バリデーターに応募
    const stake = {
      addr: this.addr,
      token: 1,
    };
    state.stakes.push(stake);
  }
}

export const node1 = new Node1();
