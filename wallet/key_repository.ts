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

export class KeyRepository {
  // データベースの代わりにするjsonファイル プロジェクトルートからのパス

  constructor(private keychainPath: string) {}

  /// 複合 秘密書 ロード
  async loadDecPvtKey(): Promise<CryptoKey | null> {
    const filePath = this.keychainPath + "/dec_pvt_key.pem";
    const pem = await Deno.readTextFile(filePath);
    if (pem.length <= 0) {
      return null;
    }
    const key = await str2decPvtKey(pem);
    return key;
  }
  /// 複合 秘密鍵 保存
  async saveDecPvtKey(key: CryptoKey): Promise<void> {
    const filePath = this.keychainPath + "/dec_pvt_key.pem";
    const pem = await pvtKey2str(key);
    // create: ファイルが存在しない場合は作成 = true
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    const opt = { append: false, create: true };
    await Deno.writeTextFile(filePath, pem, opt);
  }
  /// 暗号 公開鍵 ロード
  async loadEncPubKey(): Promise<CryptoKey | null> {
    const filePath = this.keychainPath + "/enc_pub_key.pem";
    const pem = await Deno.readTextFile(filePath);
    if (pem.length <= 0) {
      return null;
    }
    const key = await str2encPubKey(pem);
    return key;
  }
  /// 暗号 公開鍵 保存
  async saveEncPubKey(key: CryptoKey): Promise<void> {
    const filePath = this.keychainPath + "/enc_pub_key.pem";
    const pem = await pubKey2str(key);
    // create: ファイルが存在しない場合は作成 = true
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    const opt = { append: false, create: true };
    await Deno.writeTextFile(filePath, pem, opt);
  }
  /// 署名 秘密書 ロード
  async loadSignPvtKey(): Promise<CryptoKey | null> {
    const filePath = this.keychainPath + "/sign_pvt_key.pem";
    const pem = await Deno.readTextFile(filePath);
    if (pem.length <= 0) {
      return null;
    }
    const key = await str2signPvtKey(pem);
    return key;
  }
  /// 署名 秘密書 保存
  async saveSignPvtKey(key: CryptoKey): Promise<void> {
    const filePath = this.keychainPath + "/sign_pvt_key.pem";
    const pem = await pvtKey2str(key);
    // create: ファイルが存在しない場合は作成 = true
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    const opt = { append: false, create: true };
    await Deno.writeTextFile(filePath, pem, opt);
  }
  /// 検証 公開鍵 ロード
  async loadVrfyPubKey(): Promise<CryptoKey | null> {
    const filePath = this.keychainPath + "/vrfy_pub_key.pem";
    const pem = await Deno.readTextFile(filePath);
    if (pem.length <= 0) {
      return null;
    }
    const key = await str2vrfyPubKey(pem);
    return key;
  }
  /// 検証 公開鍵 保存
  async saveVrfyPubKey(key: CryptoKey): Promise<void> {
    const filePath = this.keychainPath + "/vrfy_pub_key.pem";
    const pem = await pubKey2str(key);
    // create: ファイルが存在しない場合は作成 = true
    // append: ファイルが存在する場合でも、上書きせずに末尾に追加 = false
    const opt = { append: false, create: true };
    await Deno.writeTextFile(filePath, pem, opt);
  }
}
