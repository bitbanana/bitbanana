//
//
//

// blockchain
import { FullNode, IFullNode } from "../blockchain/mod.ts";

// in-mod
import { BlockchainRepo } from "./BlockchainRepo.ts";
import { BalanceSnapshotRepo } from "./BalanceSnapshotRepo.ts";

/// Node1
class Node1 {
  addr = "@node1";
  sig = "@node1.tmp.sig";
  fullNode: IFullNode;

  constructor() {
    // DI
    const blockchainRepo = new BlockchainRepo();
    const snapshotRepo = new BalanceSnapshotRepo();
    this.fullNode = new FullNode(snapshotRepo, blockchainRepo);
  }

  // deno-lint-ignore require-await
  async init(): Promise<void> {
    // バリデーターに応募
    const stake = {
      addr: this.addr,
      token: 1,
    };
    this.fullNode.addStake(stake);
  }
}

export const node1 = new Node1();
