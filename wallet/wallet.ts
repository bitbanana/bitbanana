//
//
//

// utils
import { createSigningKeyPair } from "../utils/signing_key_pair.ts";
import { pubKey2str } from "../utils/cryption_key_pair.ts";
import { buf2str } from "../utils/buf_base64.ts";

// Repository
import { KeyRepository } from "./key_repository.ts";
import { AddressRepository } from "./address_repository.ts";

// blockchain
import { calcAddress, SenderSigContent } from "../blockchain/mod.ts";

/// Wallet
export class Wallet {
  // propaties
  address = "";
  pvtKey: CryptoKey | null = null;
  pubKey: CryptoKey | null = null;
  keychainPath: string;
  keyValueFilePath: string;

  constructor(keychainPath: string, keyValueFilePath: string) {
    this.keychainPath = keychainPath;
    this.keyValueFilePath = keyValueFilePath;
  }

  /// 初期化処理
  async initialize(): Promise<void> {
    // 保存された鍵をロード
    const r = new KeyRepository(this.keychainPath);
    this.pvtKey = await r.loadSignPvtKey();
    this.pubKey = await r.loadVrfyPubKey();
    // 鍵をまだ持っていなければ、新しく作成して保存
    if (this.pvtKey == null) {
      await this.createNewKeyPair();
      // アドレスも作成する
      await this.createNewAddress();
    }
    // 保存されたアドレスをロード
    const ar = new AddressRepository(this.keyValueFilePath);
    this.address = await ar.loadAddress();
  }

  /// 新しく鍵ペアを作成して保存
  private async createNewKeyPair(): Promise<void> {
    const r = new KeyRepository(this.keychainPath);
    const keyPair = await createSigningKeyPair();
    await r.saveSignPvtKey(keyPair.privateKey);
    await r.saveVrfyPubKey(keyPair.publicKey);
    this.pvtKey = keyPair.privateKey;
    this.pubKey = keyPair.publicKey;
  }

  /// 新しいアドレスを計算して保存
  private async createNewAddress(): Promise<void> {
    if (this.pubKey instanceof CryptoKey) {
      const strPubKey = await pubKey2str(this.pubKey);
      const address = await calcAddress(strPubKey);
      const ar = new AddressRepository(this.keyValueFilePath);
      await ar.saveAddress(address);
      this.address = address;
    } else {
      console.error("公開鍵が見つかりません");
    }
  }

  /// トランザクションを作成
  async createTx(): Promise<SenderSigContent> {
    const txId = crypto.randomUUID();
    const now = new Date().toISOString();
    // output を Json -> エンコード -> 署名
    const outputsJson = JSON.stringify("ここにはContentが入ります");
    const encoder = new TextEncoder();
    const data = encoder.encode(outputsJson);
    const signatureBuf = await crypto.subtle.sign(
      {
        name: "RSA-PSS",
        saltLength: 32, // ダイジェストアルゴリズムにSHA256を選んだ時は32がおすすめらしい
      },
      this.pvtKey!,
      data,
    );
    const signature = buf2str(signatureBuf);

    const con: SenderSigContent = {
      tx_id: txId,
      tx_page: 0,
      tx_all_pages: 0,
      r_addr: "これは私のアドレスです",
      amount: 0,
      fee: 0,
    };
    return con;
  }
}
