import { FullNode } from "../full_node/mod.ts";

class Node1 {
  addr = "@node1";
  sig = "@node1.tmp.sig";

  fullNode = new FullNode();

  // deno-lint-ignore require-await
  async init(): Promise<void> {
    // バリデーターに応募
    const stake = {
      addr: this.addr,
      token: 1,
    };
    this.fullNode.state.stakes.push(stake);
  }
}

export const node1 = new Node1();
