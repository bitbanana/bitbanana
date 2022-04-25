import {
  Block,
  createBlock as newBlock,
  Tx,
  Validator,
} from "../blockchain/mod.ts";

export async function createBlock(prevBlock: Block, tx: Tx): Promise<Block> {
  const validator: Validator = {
    address: "ValidatorOne",
    signature: "ValidatorOneSignature",
    token: 0,
  };
  const block = await newBlock(prevBlock, tx, validator);
  return block;
}
