//
//
//

export class PubKeyRepository {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス
  filePath = "./ico/db/pub_keys.json";
  async loadPubkey(addr: string): Promise<string> {
    // 連想配列(生のオブジェクト)として読み込み
    const text = await Deno.readTextFile(this.filePath);
    const dict = JSON.parse(text);
    return dict[addr];
  }
  async savePubKey(addr: string, key: string) {
    // 連想配列(生のオブジェクト)として読み込み
    let text = await Deno.readTextFile(this.filePath);
    const dict = JSON.parse(text);
    dict[addr] = key;
    text = JSON.stringify(dict, null, 2);
    // create: ファイルが存在しない場合は作成 = false
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    // 今回は 存在する場合のみ 上書き
    const opt = { append: false, create: false };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}
