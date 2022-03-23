//
//
//

import { Input } from "./input.ts";
import { Output } from "./output.ts";

// 1つの取引
export type Tx = {
  // ID
  id: string;
  // 入金
  inputs: Input[];
  // 出金
  outputs: Output[];
};
