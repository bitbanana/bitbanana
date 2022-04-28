//
//
//

// blockchain
import {
  addrIsValid,
  Block,
  blockLog,
  calcBlockHash,
  createBlock,
  pickWinner,
  SenderSigContent,
  Stake,
} from "../blockchain/mod.ts";

// Repository
import { BlockchainRepository } from "./blockchain_repository.ts";
import { PubKeyRepository } from "./pub_key_repository.ts";

// utils
import { pubKey2str, str2vrfyPubKey } from "../utils/signing_key_pair.ts";
import { str2buf } from "../utils/buf_base64.ts";

// BitFruit
import { BitFruit } from "../bit_fruit/bit_fruit.ts";

// Follower
import { Follower } from "./follower.ts";

export const bitFruit = new BitFruit();
export const whiteTxList: SenderSigContent[] = [];
export const followers: Follower[] = [];

/// フルノード
export class FullNode {
  // 検証済みの全ブロック
  blockchain: Block[] = [];
  // 検証ように流れてきた候補のブロック
  candidateBlocks: Block[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [
    {
      addr: "BitFruitWallet",
      token: 1,
    },
  ];

  async initialize(): Promise<void> {
    const r = new BlockchainRepository();
    this.blockchain = await r.loadLocalBlockchain();
  }

  // FIXME: - pubKey は事前に登録してあるやつを探してくる
  // startBonus のAPIで登録にしようかな
  async onReceiveWhiteTx(
    s_sig: string,
    con: SenderSigContent,
    _pubKey: CryptoKey,
  ): Promise<void> {
    const pubKey = _pubKey;
    const strPubKey = await pubKey2str(pubKey);
    const txIsOk = await this.verifyTx(s_sig, strPubKey, con);
    if (true) {
      // txは検証されました
      const winnerStake = pickWinner(this.stakes);
      const prevBlock = this.blockchain[this.blockchain.length - 1];
      const block = await bitFruit.createBlock(prevBlock, con, winnerStake);
      this.blockchain.push(block);
      const r = new BlockchainRepository();
      await r.saveLocalBlockchain(this.blockchain);
      this.notifyGreenTx(con);
      // FIXME: - ここで他のノードへ新しいチェーンを共有
    } else {
      console.log("改ざんされたトランザクションです");
    }
  }

  notifyGreenTx(content: SenderSigContent) {
    for (const f of followers) {
      f.onGreenTx([content]);
    }
  }

  async verifyTx(
    sig: string,
    strPubKey: string,
    con: SenderSigContent,
  ): Promise<boolean> {
    const targetJson = JSON.stringify(con);
    const encoder = new TextEncoder();
    const targetBuf = encoder.encode(targetJson);
    const pubKey = await str2vrfyPubKey(strPubKey);
    const sigBuf = await str2buf(sig);
    const result = await crypto.subtle.verify(
      {
        name: "RSA-PSS",
        saltLength: 32,
      },
      pubKey,
      sigBuf,
      targetBuf,
    );
    return result;
  }

  async savePubKey(addr: string, strPubKey: string): Promise<void> {
    const isValidAddr = await addrIsValid(addr, strPubKey);
    if (isValidAddr) {
      const pkr = new PubKeyRepository();
      await pkr.savePubKey(addr, strPubKey);
    } else {
      console.log("公開鍵とアドレスが矛盾しています");
    }
  }

  async startServer() {
    // ストレージから読み込み
    const repository = new BlockchainRepository();
    this.blockchain = await repository.loadLocalBlockchain();

    console.log(`ブロックチェーンを読み込みました: \n${blockLog(this.blockchain[0])}`);

    // ここでWS接続
    // ポートを開いてサーバー起動
    const tcpPort = 5001;
    // FIXME: 実装

    // 接続されたpeerに対してお互いが持っているブロックチェーンを同期する
    // 置き換える前にブロック1つずつに対して不正チェック
    // FIXME: 実装

    // 更新された
    // 不正なブロックに関しては、バリデーターのステークを没収
    // FIXME: 実装
    if (true) {
      // validators に追加する
    } else {
      // トークンを没収
    }

    // 当選したバリデーターが提案したブロックをブロックチェーンに追加する
    // 先に提案してもらうか、当選してから提案してもらうかは自由
    // バリデーターへの手数料をお忘れなく
    // FIXME: 実装

    // 他のバリデーターにも最新のブロックチェーンを配布
    // 受け取った側はローカルへ保存
    // FIXME: 実装
  }
}
