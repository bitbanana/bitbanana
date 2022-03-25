//
//
//

// ICO
import { Ico } from "./ico/ico.ts";

// Fruit Server
import { FruitServer } from "./fruit_server/fruit_server.ts";

// Wallet
import { Wallet } from "./wallet/wallet.ts";

// blockchain
import {
  addrIsValid,
  calcBlockHash,
  correctHashOfBlock,
} from "./blockchain/mod.ts";

// utils
import { pubKey2str } from "./utils/signing_key_pair.ts";

// initializer
import { Initializer } from "./initial_data/initializer.ts";

// test
import { PubKeyRepository } from "./ico/pub_key_repository.ts";

const i = new Initializer();
i.deleteAll();

// コメント解除して実行
// main();

async function main() {
  const ico = new Ico();
  ico.startServer();

  const w = new Wallet();
  await w.initialize();

  console.log(`Wallet @addr: ${w.address}`);

  const strPubKey = await pubKey2str(w.pubKey!);
  const isValidAddr = await addrIsValid(w.address, strPubKey);

  console.log(`isValid Addr?: ${isValidAddr}`);

  const tx = await w.createTx();
  const txIsOk = await ico.verifyTx(tx, strPubKey);

  console.log(`isValid Tx?: ${txIsOk}`);

  await ico.onReceiveTx(tx, w.pubKey!);

  const genB = ico.blockchain[0];
  const genBlockHash = await correctHashOfBlock(genB);

  console.log(`正しい初期ブロックハッシュ: ${genBlockHash}`);

  const fServer = new FruitServer();

  const balance = await ico.calcBalance(w.address);
  await fServer.createUser(w.address, balance);

  await fServer.userBuyItem(w.address, 7, 4);

  const pr = new PubKeyRepository();
  pr.savePubKey("hira", "pubkey");
}
