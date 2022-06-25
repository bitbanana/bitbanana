//
// Validator
//

// in-mod
import { Block } from "./types/Block.ts";
import { Stake } from "./types/Stake.ts";
import { Tx } from "./types/Tx.ts";
import { ValidatorSigContent } from "./types/ValidatorSigContent.ts";
import { createBlock as _createBlock } from "./functions/createBlock.ts";
import { IValidateSigner } from "./interfaces/IValidateSigner.ts";
import { callApplyStake } from "./functions/callApplyStake.ts";

export class Validator {
  // addr
  addr: string;
  // signer
  signer: IValidateSigner;

  // constructor
  constructor(addr: string, signer: IValidateSigner) {
    this.addr = addr;
    this.signer = signer;
  }

  // deno-lint-ignore require-await
  async apply(nodeUrl: string): Promise<void> {
    // バリデーターに応募
    const stake: Stake = {
      addr: this.addr,
      token: 1,
      url_create_block: "no url",
    };
    callApplyStake(stake, nodeUrl);
  }

  async createBlock(
    tx: Tx,
    prevBlock: Block,
    winnerStake: Stake,
  ): Promise<Block> {
    const sigContent: ValidatorSigContent = {
      s_sig: tx.s_sig,
      fee: tx.s_sig_cont.fee,
      v_token: winnerStake.token,
    };
    const vSig = this.signer.createSig(sigContent);
    const block = await _createBlock(
      prevBlock,
      tx.s_sig_cont,
      tx.s_addr,
      tx.s_sig,
      winnerStake,
      vSig,
    );
    return block;
  }
}
