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

// 抽選に参加しているバリデーター
// ブロックチェーンは運営がいないので、その代わりの人たち
type Validator = {
  address: string;
  // 応募金 敷金みたいな感じで帰ってくるので安心
  // FIXME: これの数 * バリデーター数 でループすることになるので上限をつけた方が良さそう
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
  // 抽選に参加しているバリデーターたち
  validators: Validator[] = [];

  async loadLocalBlockchain() {
    const r = new BlockRepository();
    this.blockchain = await r.loadLocalBlockchain();
  }

  async saveLocalBlockchain() {
    const r = new BlockRepository();
    await r.saveLocalBlockchain(this.blockchain);
  }

  // 他のフルノードと同期する
  validatorIsOk(v: Validator): boolean {
    // FIXME: 実装
    return true;
  }

  async startServer() {
    // ストレージから読み込み
    await this.loadLocalBlockchain();

    // ここでWS接続
    // ポートを開いてサーバー起動
    const tcpPort = 5001;
    // FIXME: 実装

    // 以下、接続後...
    // 接続されたバリデーターたち
    const validators: Validator[] = [];
    for (const v of validators) {
      // 不正チェック
      if (this.validatorIsOk(v)) {
        // validators に追加する
        // FIXME: 候補ブロックもバリデーター型の中に入れてしまおうかな
        // お互いが持っているブロックチェーンを交換し合う
      } else {
        // トークンを没収
      }
    }

    // FIXME: 前の抽選から30秒に一回くらいの頻度で実施 誰が実行命令するんやろ? FullNodeよりも偉いサーバー?
    const pickedV = pickValidator(this.validators);

    // 当選したバリデーターが提案したブロックをブロックチェーンに追加する
    // 先に提案してもらうか、当選してから提案してもらうかは自由
    // バリデーターへの手数料をお忘れなく
    // FIXME: 実装

    // 他のバリデーターにも最新のブロックチェーンを配布
    // 受け取った側はローカルへ保存
    // FIXME: 実装
  }
}

// 通信担当の部分
class FullNodeServer {
}

// 抽選プールを作って、ブロックを追加する権利があるwinnerを決める
// ステーク(預けておいた)されたトークンの量に応じて当選率が上がる
function pickValidator(validators: Validator[]): string {
  // 抽選の応募者がいない場合は終了
  if (validators.length < 0) {
    console.log("バリデーターが不足しています");
    return "";
  }

  // 抽選箱
  const lotteryPool: string[] = [];
  // 全ての抽選者に対して
  for (let v of validators) {
    // 応募金の数だけ抽選箱にアドレスを追加
    const range = Array.from(Array(v.token).keys()); // 0..length
    for (const _ of range) {
      lotteryPool.push(v.address);
    }
  }

  // 抽選箱からランダムに一つ取り出す
  const randomIndex = Math.floor(Math.random() * lotteryPool.length);
  return lotteryPool[randomIndex];
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
function createBlock(
  prevB: Block,
  tx: Transaction,
  validator: string,
): Block {
  const time = new Date().toISOString();
  // 仮のハッシュ値でブロックを生成
  const block: Block = {
    index: prevB.index + 1,
    time: time,
    data: tx,
    hash: "temp",
    prev_hash: prevB.hash,
    validator: validator,
  };
  // 正しいハッシュを計算
  block.hash = calcBlockHash(block);
  return block;
}

class BlockRepository {
  // データベースの代わりにするjsonファイル
  filePath = "all_blocks.json";
  async loadLocalBlockchain(): Promise<Block[]> {
    // ファイルのテキストを読み込む
    const text = await Deno.readTextFile(this.filePath);
    // Block型の配列へ変換する
    const allBlocks: Block[] = JSON.parse(text);
    return allBlocks;
  }
  async saveLocalBlockchain(allBlocks: Block[]) {
    // Block型の配列をテキストへ変換する
    const text = JSON.stringify(allBlocks);
    // create: ファイルが存在しない場合は作成 = false
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    // 今回は 存在する場合のみ 上書き
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}

// ブロックのハッシュを計算する
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
