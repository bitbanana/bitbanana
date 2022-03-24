//
//
//

import {move} from "../deps.ts";

export class Initializer {
       async deleteAll(): Promise<void> {
              
await move("./blockchain.json", "./ico/db/blockchain.json", { overwrite: true });
       }
}