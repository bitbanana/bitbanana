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

// 1つの取引
type Transaction = {
  // 送信者
  sender: string;
  // 受信者
  recipient: string;
  // アイテム ID
  item_id: string;
  // 数量
  amount: number;
};

function tx2String(tx: Transaction): string {
  const str = tx.sender +
    tx.recipient +
    tx.item_id +
    tx.amount.toString();
  return str;
}

// 1つのブロック
// T: ブロックの中に閉じ込めたいデータの型
type PoSBlock<T> = {
  // ブロックチェーンに必要
  index: number;
  time: string;
  prev_hash: string;
  hash: string;
  // ブロックの中に閉じ込めたいデータ
  data: T;
  // PoS に必要
  validator: string;
};

type Block = PoSBlock<Transaction>;

type Validator = {
  address: string;
  token: number;
};

// 純粋な SHA256 ハッシュ関数
function calcHash(str: string): string {
  // FIXME: - 中身はパッケージ等を利用して実装する
  // 今回は依存関係を増やしたくなかったので省略
  return str;
}

class Wallet {
}

class FullNode {
  // 検証済みの全ブロック配列
  blockchain: Block[] = [];
  // 検証ように流れてきた候補のブロックたち
  // バリデーターと紐付けておいた方が良さそう
  candidateBlocks: Block[] = [];
  // 抽選に参加しているバリデーターたち と 応募金(token と呼ばれる)
  // ブロックチェーンは運営がいないので、その代わりの人たち
  // 応募金というか敷金みたいな感じで帰ってくるので安心
  // Map 使いたくないので、うまいこと名前を変えるかクラスを作りたい
  validators = new Map<string, number>();

  async loadLocalBlockchain() {
    const repository = new BlockRepository();
    this.blockchain = await repository.loadLocalBlockChain();
  }

  // FIXME: - 差分だけ書き込めた方が良い
  async saveLocalBlockChain() {
    const repository = new BlockRepository();
    await repository.saveLocalBlockchain(this.blockchain);
  }

  // 他のフルノードと同期する
  async syncWithOtherNodes() {
    // FIXME: 実装
  }

  async startServer() {
    // ストレージから読み込み -> 他のノードと同期
    await this.loadLocalBlockchain();
    await this.syncWithOtherNodes();

    // ポートを開いてサーバー起動
    const tcpPort = 5001;
    // FIXME: - 実装

    // バリデーターを選ぶことができるサーバーで実行
    // FIXME: 30秒に一回くらい
    pickValidator();
    handleConn("WSコネクション");
  }
}

// 通信担当の部分
class FullNodeServer {
}

// 抽選プールを作って、ブロックを追加する権利があるwinnerを決める
// ステーク(預けておいた)されたトークンの量に応じて当選率が上がる
function pickValidator() {
  // 抽選の応募者がいない場合は終了
  if (fullNode.validators.keys.length < 0) {
    return;
  }

  // 抽選箱
  const lotteryPool: string[] = [];
  // 全ての抽選者に対して
  for (let [address, token] of fullNode.validators) {
    // 応募金の数だけ抽選箱にアドレスを追加
    const range = Array.from(Array(token).keys()); // 0..length
    for (const _ of range) {
      lotteryPool.push(address);
    }
  }

  // 抽選箱からランダムに一つ取り出す
  const randomIndex = Math.floor(Math.random() * lotteryPool.length);
  const pickedValidatorAddress = lotteryPool[randomIndex];

  // 当選したバリデーターが提案したブロックをブロックチェーンに追加する
  // 先に提案してもらうか、当選してから提案してもらうかは自由
  // バリデーターへの手数料をお忘れなく
  // FIXME: 実装

  // 他のバリデーターにも最新のブロックチェーンを配布
  // 受け取ったらローカルへ保存
  // FIXME: 実装
}

// FIXME: コネクションはstringではない
// 接続された時の処理
function handleConn(conn: string) {
  // バリデーターが接続されたので validators に追加する
  // FIXME: 実装

  // 不正なブロックを提案されたら、そのブロックを削除 トークンを没収
  // そうでない場合は 候補ブロック配列へ追加
  // FIXME: 実装

  // お互いが持っているブロックチェーンを交換し合う
  // FIXME: 実装
}

// ブロックが有効かどうか確認する
function blockIsValid(b: Block, prevB: Block): boolean {
  // ハッシュを正しい計算方法で再計算 (中身が偽造されていないことを確認)
  const hashIsCorrect = calcBlockHash(b) == b.hash;
  if (!hashIsCorrect) {
    return false;
  }
  // インデックスを確認 (連続したブロックであることを確認)
  if (b.index != prevB.index + 1) {
    return false;
  }
  // ハッシュを確認 (ハッシュが引き継がれているか)
  if (b.prev_hash != prevB.hash) {
    return false;
  }
  return true;
}

// 新しいブロックを生成
function generateBlock(
  oldBlock: Block,
  data: Transaction,
  validatorAddress: string,
): Block {
  const time = new Date().toISOString();
  // ハッシュは仮の値
  const block: Block = {
    index: oldBlock.index,
    time: time,
    data: data,
    hash: "仮の値",
    prev_hash: oldBlock.hash,
    validator: validatorAddress,
  };
  // ハッシュを計算
  const hash = calcBlockHash(block);
  block.hash = hash;
  return block;
}

class BlockRepository {
  // データベースの代わりにするjsonファイル
  filePath = "all_blocks.json";
  async loadLocalBlockChain(): Promise<Block[]> {
    // ファイルのテキストを読み込む
    const text = await Deno.readTextFile(this.filePath);
    // Block型の配列へ変換する
    const allBlocks: Block[] = JSON.parse(text);
    return allBlocks;
  }
  saveLocalBlockchain(allBlocks: Block[]) {
    // Block型の配列をテキストへ変換する
    const text = JSON.stringify(allBlocks);
    // create: ファイルが存在しない場合は作成 = false
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    // 今回は 存在する場合のみ 上書き
    const opt = { append: false, create: false };
    Deno.writeTextFile(this.filePath, text, opt);
  }
}

// ブロックのハッシュを計算する
// FIXME: - 一時的にハッシュが仮の状態になってるのどうにかならんか
function calcBlockHash(b: Block): string {
  // 順番は大切なので仕様を決めておく
  // とりあえずハッシュ以外の全部の情報を詰め込んでおけばOK
  const str = b.index.toString() +
    b.time +
    b.prev_hash +
    tx2String(b.data) +
    b.validator;
  return calcHash(str);
}

// フルノード (全てのブロックを持っている)
const fullNode = new FullNode();

function main() {
  fullNode.startServer();
}

// 実行
main();
