//
//
//

// blockchain
import {
  addrIsValid,
  Block,
  blockLog,
  calcBlockHash,
  correctHashOfBlock,
  createBlock,
  pickWinner,
  Stake,
  Tx,
  Validator,
} from "../blockchain/mod.ts";

// Repository
import { BlockchainRepository } from "./blockchain_repository.ts";
import { PubKeyRepository } from "./pub_key_repository.ts";

// utils
import { pubKey2str, str2vrfyPubKey } from "../utils/signing_key_pair.ts";
import { str2buf } from "../utils/arybuf_base64.ts";

/// 中央発行局
export class Ico {
  // 検証済みの全ブロック
  blockchain: Block[] = [];
  // 検証ように流れてきた候補のブロック
  candidateBlocks: Block[] = [];
  // 抽選に参加しているバリデーターのステーク
  stakes: Stake[] = [];

  onXXX() {
    // FIXME: 前の抽選から30秒に一回くらいの頻度で実施
    const pickedV = pickWinner(this.stakes);
  }

  // FIXME: - pubKey は事前に登録してあるやつを探してくる
  async onReceiveTx(tx: Tx, _pubKey: CryptoKey): Promise<void> {
    const pubKey = _pubKey;
    const strPubKey = await pubKey2str(pubKey);
    const txIsOk = await this.verifyTx(tx, strPubKey);
    if (txIsOk) {
      // txは検証されました
      const prevBlock = this.blockchain[this.blockchain.length - 1];
      const validator: Validator = {
        address: "center",
        signature: "xxx",
        token: 0,
      };
      const block = await createBlock(prevBlock, tx, validator);
      // FIXME: - ここでブロックの検証に入る 今はこのサーバーしかバリデーターがいないので素通り
      this.blockchain.push(block);
      const r = new BlockchainRepository();
      r.saveLocalBlockchain(this.blockchain);
      // FIXME: - ここで新しいチェーンを共有
    } else {
      console.log("改ざんされたトランザクションです");
    }
  }

  async verifyTx(tx: Tx, strPubKey: string): Promise<boolean> {
    const targetOutputs = tx.outputs;
    const targetJson = JSON.stringify(targetOutputs);
    const encoder = new TextEncoder();
    const jsonBuf = encoder.encode(targetJson);
    const pubKey = await str2vrfyPubKey(strPubKey);
    // FIXME: - 全てのサインに対して実施する
    const signatureBuf = await str2buf(tx.inputs[0].signature);
    const result = await crypto.subtle.verify(
      {
        name: "RSA-PSS",
        saltLength: 32,
      },
      pubKey,
      signatureBuf,
      jsonBuf,
    );
    return result;
  }

  // UTXO から 残高を求める
  async calcBalance(addr: string): Promise<number> {
    // FIXME: - 計算
    return 80;
  }

  async savePubKey(addr: string, strPubKey: string): Promise<void> {
    const isValidAddr = await addrIsValid(addr, strPubKey);
    if (isValidAddr) {
      const pkr = new PubKeyRepository();
      pkr.savePubKey(addr, strPubKey);
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
