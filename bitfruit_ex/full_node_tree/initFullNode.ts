//
//
//

// bitbanana
import { FullNode, IFullNode } from "../../bitbanana/mod.ts";
// in-mod
import { bitfruitExAddr } from "../config/config.ts";
import { BlockchainRepo } from "./BlockchainRepo.ts";
import { BalanceSnapshotRepo } from "./BalanceSnapshotRepo.ts";

const blockchainRepo = new BlockchainRepo();
const snapshotRepo = new BalanceSnapshotRepo();

// use this as full node in the server
export function initFullNode(): IFullNode {
  const fullNode = new FullNode(
    bitfruitExAddr,
    snapshotRepo,
    blockchainRepo,
  );
  return fullNode;
}
