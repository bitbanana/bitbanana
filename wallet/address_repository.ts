//
//
//

// utils
import {
  pubKey2str,
  pvtKey2str,
  str2decPvtKey,
  str2encPubKey,
} from "../utils/cryption_key_pair.ts";
import { str2signPvtKey, str2vrfyPubKey } from "../utils/signing_key_pair.ts";
import type { KeyValue } from "./types/key_value.ts";

export class AddressRepository {
  filePath = "./wallet/storage/key_value.json";
  /// アドレスを読み込み
  async loadAddress(): Promise<string> {
    const text = await Deno.readTextFile(this.filePath);
    if (text.length <= 0) {
      return "";
    }
    const keyValue: KeyValue = JSON.parse(text);
    return keyValue.address;
  }
  /// アドレスを保存
  async saveAddress(address: string): Promise<void> {
    let text = await Deno.readTextFile(this.filePath);
    let keyValue: KeyValue;
    if (text == undefined || text == "") {
      // まだ作成されていなければ新しく作成
      keyValue = {
        address: address,
      };
    } else {
      // すでに存在していたら アドレスのみ上書きして保存
      keyValue = JSON.parse(text);
      keyValue.address = address;
    }
    text = JSON.stringify(keyValue, null, 2);
    // create: ファイルが存在しない場合は作成 = true
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    const opt = { append: false, create: true };
    await Deno.writeTextFile(this.filePath, text, opt);
  }
}
