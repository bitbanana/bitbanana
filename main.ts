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

// Key Pair
import {
  createKeyPair,
  privateKey2str,
  publicKey2str,
  str2privateKey,
  str2publicKey,
} from "./utils/key_pair.ts";

const ico = new Ico();
ico.startServer();

const keyPair = await createKeyPair();
const pristr = await privateKey2str(keyPair.privateKey);
const pubstr = await publicKey2str(keyPair.publicKey);

const privateKey = await str2privateKey(pristr);
const publicKey = await str2publicKey(pubstr);

const encoder = new TextEncoder();
const encoded = encoder.encode("Hello Hira");
const ango = await crypto.subtle.encrypt(
  {
    name: "RSA-OAEP",
  },
  publicKey,
  encoded,
);

const hirabun = await crypto.subtle.decrypt(
  {
    name: "RSA-OAEP",
  },
  privateKey,
  ango,
);

const decoder = new TextDecoder();
const hello = decoder.decode(hirabun);

console.log(hello);
