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

type Block = {
       // ブロックチェーンに必要
       index: number
       time: string
       prevHash: string
       hash: string
       // ブロックの中に閉じ込めたいデータ
       data: number
       // PoS に必要
       validator: string
}

// 純粋な SHA256 ハッシュ関数
function calculateHash(str: string): string {
       // FIXME: - 中身はパッケージ等を利用して実装する
       // 今回は依存関係を増やしたくなかったので省略
       return str
}

// 以下プロパティたちは　Node クラスの中に入れても良さそう
// ちなみに今回は Node = Validator になっている

// 検証済みの有効なブロックたち
let blockchain: Block[] = [];

// 検証ように流れてきた候補のブロックたち
// バリデーターと紐付けておいた方が良さそう
var candidateBlocks: Block[] = []

// 抽選に参加しているバリデーターたち と 応募金(token と呼ばれる)
// ブロックチェーンは運営がいないので、その代わりの人たち
// 応募金というか敷金みたいな感じで帰ってくるので安心
// Map 使いたくないので、うまいこと名前を変えるかクラスを作りたい
var validators = new Map<string, number>();

// ブロックのハッシュを計算する
// FIXME: - 一時的にハッシュが仮の状態になってるのどうにかならんか
function calculateBlockHash(block: Block): string {
       // 順番は大切なので仕様を決めておく
       // とりあえずハッシュ以外の全部の情報を詰め込んでおけばOK
       const blockString =
              block.index.toString() +
              block.time +
              block.prevHash +
              block.data.toString() +
              block.validator
       return calculateHash(blockString)
}

function main() {

       console.log("Hello Bit Banana");

       // FIXME: - ジェネシスブロックはあらかじめデータベースに永続化しておいた方が良さそう
       // ストレージから読み込み -> 他のノードと同期 みたいな感じで
       // 最初のブロックを作る
       const genesisTime = Date.now()
       // ハッシュは仮の値
       const genesisBlock: Block = {
              index: 0,
              time: genesisTime.toString(),
              data: 0,
              hash: "仮の値",
              prevHash: "----",
              validator: "genesis"
       };
       // ハッシュを計算
       const genesisHash = calculateBlockHash(genesisBlock)
       genesisBlock.hash = genesisHash
       blockchain.push(genesisBlock)

       // ポートを開いてサーバー起動
       const tcpPort = 5001
       // FIXME: - 実装

       // バリデーターを選ぶことができるサーバーで実行
       // FIXME: 30秒に一回くらい
       pickValidator()
       handleConn("WSコネクション")
}

// 抽選プールを作って、ブロックを追加する権利があるwinnerを決める
// ステーク(預けておいた)されたトークンの量に応じて当選率が上がる
function pickValidator() {

       // 抽選の応募者がいない場合は終了
       if (validators.keys.length < 0) {
              return
       }

       // 抽選のくじ引き箱
       const lotteryPool: string[] = []
       // 全ての抽選者に対して
       for (let [validatorAddress, tokenCount] of validators) {
              // 応募金の数だけ抽選箱に名前を追加
              Array.from(Array(tokenCount).keys()).forEach(c => {
                     lotteryPool.push(validatorAddress)
              })
       }

       // 抽選箱からランダムに一つ取り出す
       const randomIndex = Math.floor(Math.random() * lotteryPool.length)
       const pickedValidatorAddress = lotteryPool[randomIndex];


       // 当選したバリデーターが提案したブロックをブロックチェーンに追加する
       // 先に提案してもらうか、当選してから提案してもらうかは自由
       // バリデーターへの手数料をお忘れなく
       // FIXME: 実装

       // 他のバリデーターにも最新のブロックチェーンを配布
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
function isBlockValid(newBlock: Block, oldBlock: Block): boolean {
       // ハッシュを正しい計算方法で再計算 (中身が偽造されていないことを確認)
       const hashIsCorrect = calculateBlockHash(newBlock) == newBlock.hash
       if (!hashIsCorrect) {
              return false
       }
       // インデックスを確認 (連続したブロックであることを確認)
       if (newBlock.index != oldBlock.index + 1) {
              return false
       }
       // ハッシュを確認 (ハッシュが引き継がれているか)
       if (newBlock.prevHash != oldBlock.hash) {
              return false
       }
       return true
}

// 新しいブロックを生成
function generateBlock(oldBlock: Block, data: number, validatorAddress: string): Block {

       const time = Date.now().toString()
       // ハッシュは仮の値
       const block: Block = {
              index: oldBlock.index,
              time: time,
              data: data,
              hash: "仮の値",
              prevHash: oldBlock.hash,
              validator: validatorAddress
       };
       // ハッシュを計算
       const hash = calculateBlockHash(block)
       block.hash = hash
       return block
}

// 実行
main()

console.log(blockchain)