//
//
//

// utils
import { createSigningKeyPair } from "../utils/signing_key_pair.ts";
import { pubKey2str } from "../utils/cryption_key_pair.ts";
import { buf2str } from "../utils/arybuf_base64.ts";

// Repository
import { KeyRepository } from "./key_repository.ts";
import { AddressRepository } from "./address_repository.ts";

// blockchain
import { calcAddress, Input, Output, Tx } from "../blockchain/mod.ts";

/// Wallet
export class Wallet {
  // propaties
  address = "";
  pvtKey: CryptoKey | null = null;
  pubKey: CryptoKey | null = null;

  /// 初期化処理
  async initialize(): Promise<void> {
    // 保存された鍵をロード
    const r = new KeyRepository();
    this.pvtKey = await r.loadSignPvtKey();
    this.pubKey = await r.loadVrfyPubKey();
    // 鍵をまだ持っていなければ、新しく作成して保存
    if (this.pvtKey == null) {
      await this.createNewKeyPair();
      // アドレスも作成する
      await this.createNewAddress();
    }
    // 保存されたアドレスをロード
    const ar = new AddressRepository();
    this.address = await ar.loadAddress();
  }

  /// 新しく鍵ペアを作成して保存
  private async createNewKeyPair(): Promise<void> {
    const r = new KeyRepository();
    const keyPair = await createSigningKeyPair();
    r.saveSignPvtKey(keyPair.privateKey);
    r.saveVrfyPubKey(keyPair.publicKey);
    this.pvtKey = keyPair.privateKey;
    this.pubKey = keyPair.publicKey;
  }

  /// 新しいアドレスを計算して保存
  private async createNewAddress(): Promise<void> {
    if (this.pubKey instanceof CryptoKey) {
      const strPubKey = await pubKey2str(this.pubKey);
      const address = await calcAddress(strPubKey);
      const ar = new AddressRepository();
      await ar.saveAddress(address);
      this.address = address;
    } else {
      console.error("公開鍵が見つかりません");
    }
  }

  /// トランザクションを作成
  async createTx(): Promise<Tx> {
    const txId = crypto.randomUUID();
    const now = new Date().toISOString();
    const outputs: Output[] = [
      {
        to: "center",
        amount: 50,
        fee: 5,
      },
    ];
    // output を Json -> エンコード -> 署名
    const outputsJson = JSON.stringify(outputs);
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
    const inputs: Input[] = [
      {
        time: now,
        from: this.address,
        signature: signature,
      },
    ];
    const tx: Tx = {
      id: txId,
      inputs: inputs,
      outputs: outputs,
    };
    return tx;
  }
}
