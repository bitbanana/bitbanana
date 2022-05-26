//
//
//

// utils
import * as date_format from "../utils/date_format.ts";
import * as base58 from "../utils/base58.ts";
import * as hash from "../utils/sha256.ts";

import { Block } from "../blockchain/mod.ts";

//
class Validator {
  // 検証済みの全ブロック
  blockchain: Block[];

  // コンストラクタ
  constructor(blockchain: Block[]) {
    this.blockchain = blockchain;
  }
}
