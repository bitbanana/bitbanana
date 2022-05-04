//
//
//

import { copySync } from "../deps.ts";

export class Initializer {
  deleteAll() {
    copySync(
      "./initial_data/blockchain.json",
      "./bit_banana/db/blockchain.json",
      {
        overwrite: true,
      },
    );
    copySync("./initial_data/users.json", "./bit_fruit/db/users.json", {
      overwrite: true,
    });
    copySync("./initial_data/pub_keys.json", "./bit_banana/db/pub_keys.json", {
      overwrite: true,
    });
    copySync(
      "./initial_data/dec_pvt_key.pem",
      "./bit_fruit/keychain/dec_pvt_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/enc_pub_key.pem",
      "./bit_fruit/keychain/enc_pub_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/sign_pvt_key.pem",
      "./bit_fruit/keychain/sign_pvt_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/vrfy_pub_key.pem",
      "./bit_fruit/keychain/vrfy_pub_key.pem",
      {
        overwrite: true,
      },
    );
    copySync(
      "./initial_data/key_value.json",
      "./bit_fruit/storage/key_value.json",
      {
        overwrite: true,
      },
    );
  }
}
