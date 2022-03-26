//
//
//

// PosServer
import { PosServer } from "./pos_server/pos_server.ts";

// Fruit Server
import { FruitServer } from "./fruit_server/fruit_server.ts";

// Wallet
import { Wallet } from "./wallet/wallet.ts";

// utils
import { pubKey2str } from "./utils/signing_key_pair.ts";

// initializer
import { Initializer } from "./initial_data/initializer.ts";

// 全てのデータを初期化
const i = new Initializer();
i.deleteAll();

// コメント解除して実行
// main();

async function main() {
  // 鍵とアドレスを保持
  const w = new Wallet();
  await w.initialize();

  // pos_server server 立ち上げ
  const pos_server = new PosServer();
  await pos_server.startServer();

  // pos_server に 公開鍵 を登録
  const strPubKey = await pubKey2str(w.pubKey!);
  await pos_server.savePubKey(w.address, strPubKey);

  // 残高を確認
  const balance = await pos_server.calcBalance(w.address);

  // fruit server 立ち上げ
  const fServer = new FruitServer();

  // fruit server 利用者登録
  await fServer.createUser(w.address);

  // 現在のアイテム価格一覧を取得
  const itemPrices = await fServer.getItemPrices();

  // 購入アイテムを決定
  const itemId = 0;
  const onePrice = itemPrices["0"];
  const itemCount = 3;

  // 支払いのトランザクションを作成
  const tx = await w.createTx();

  // 購入開始
  await fServer.userBuyItem(w.address, itemId, 3, tx.id);

  // 支払い
  await pos_server.onReceiveTx(tx, w.pubKey!);
}
