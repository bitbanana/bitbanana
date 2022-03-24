//
//
//

import { copySync } from "../deps.ts";

export class Initializer {
  deleteAll() {
    copySync("./initial_data/blockchain.json", "./ico/db/blockchain.json", {
      overwrite: true,
    });
    copySync(
      "./initial_data/dec_pvt_key.pem",
      "./wallet/keychain/dec_pvt_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/enc_pub_key.pem",
      "./wallet/keychain/enc_pub_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/sign_pvt_key.pem",
      "./wallet/keychain/sign_pvt_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/vrfy_pub_key.pem",
      "./wallet/keychain/vrfy_pub_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/key_value.json",
      "./wallet/storage/key_value.json",
      {
        overwrite: true,
      },
    );
  }
}
