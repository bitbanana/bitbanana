//
//
//

// PosServer
import { FullNode } from "./full_node/full_node.ts";

// Fruit Server
import { BitFruit } from "./bit_fruit/bit_fruit.ts";

// Wallet
import { Wallet } from "./wallet/wallet.ts";

// utils
import { pubKey2str } from "./utils/signing_key_pair.ts";

import { startBonus } from "./full_node/web_api.ts";

await startBonus("rbdog");

// main();

async function main() {
  // 鍵とアドレスを保持
  const w = new Wallet("./wallet/keychain", "./wallet/storage/key_value.json");
  await w.initialize();

  // full node server 立ち上げ
  const fullNode = new FullNode();
  await fullNode.startServer();

  // full node に 公開鍵 を登録
  const strPubKey = await pubKey2str(w.pubKey!);
  await fullNode.savePubKey(w.address, strPubKey);

  // 残高を確認
  const balance = 0; // 未実装

  // fruit server 立ち上げ
  const fServer = new BitFruit();

  // fruit server 利用者登録
  await fServer.createUser(w.address);

  // 現在のアイテム価格一覧を取得
  const itemPrices = await fServer.getItemPrices();

  // 購入アイテムを決定
  const itemId = 0;
  const onePrice = itemPrices["0"];
  const itemCount = 3;

  // 支払いのトランザクションを作成
  const con = await w.createTx();

  // 購入開始
  await fServer.userBuyItem(w.address, itemId, 3, con.tx_id);

  // 支払い
  await fullNode.onReceiveWhiteTx("これは私の署名です", con, w.pubKey!);
}
