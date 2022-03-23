//
//
//

// blockchain
import { Block, blockLog, pickWinner, Stake } from "../blockchain/mod.ts";

// Repository
import { BlockchainRepository } from "./blockchain_repository.ts";

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
