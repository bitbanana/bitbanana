//
//
//

//
// 新時代のブロックチェーン実装, Proof of Work はもう古い?!
// Proof of Stake, Proof of Importance, TypeScript 実装コードまとめ　とかの記事が良さそう
// Proof of Stake の実装記事がヒットしなかったのでかく
// PoWとの違いは nonce ではなく validator がブロックに入ること
// difficulty(難易度操作) version(実装バージョン) は任意で入れる
// コード中に細かくコメントを入れたので 人によってはそちらを参照してもらった方が記事を読むより理解が早いかも
// シェアの計算に コインエイジと最近の取引を利用する方法もあとで紹介する
// その場合は シェア や 前のブロック生成から経過した時間 もブロック情報に入れる
//
// この人の記事が勉強になった
// https://yu-kimura.jp/2018/06/25/proof-of-stake-implementation/
// もう学生じゃないので細かい数式は勉強しなくても電卓にやらせちゃえ
// hがハッシュ値、bがシェア、dが難易度、tが時間
// tが大きくなれば成功 = 時間が経てば成功 = ほっときゃいつか上手くいく
//

// ICO
import { Ico } from "./ico/ico.ts";

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
import {Initializer} from "./initial_data/initializer.ts";

const i = new Initializer();
i.deleteAll();

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

}