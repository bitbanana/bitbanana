//
//
//

import { buf2str, str2buf } from "./buf_base64.ts";

// 新しい 署名用の 鍵ペアを作成
export async function createSigningKeyPair(): Promise<CryptoKeyPair> {
  // PSS = 署名に使うやつ
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]), // = 2^16 + 0 + 2^0 = 65537 キリの良い素数
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );
  return keyPair;
}

// private Key -> string
export async function pvtKey2str(key: CryptoKey): Promise<string> {
  // pkcs8 = 秘密鍵のフォーマットに関する標準 RFC 5208
  const buf = await crypto.subtle.exportKey(
    "pkcs8",
    key,
  );
  const b64 = buf2str(buf);
  const pem = `-----BEGIN PRIVATE KEY-----\n${b64}\n-----END PRIVATE KEY-----`;
  return pem;
}

// public Key -> string
export async function pubKey2str(key: CryptoKey): Promise<string> {
  // spki = 公開鍵のフォーマット標準
  const buf = await crypto.subtle.exportKey(
    "spki",
    key,
  );
  const b64 = buf2str(buf);
  const pem = `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`;
  return pem;
}

// string -> sign private Key
export async function str2signPvtKey(pem: string): Promise<CryptoKey> {
  const pemHeader = `-----BEGIN PRIVATE KEY-----\n`;
  const pemFooter = `\n-----END PRIVATE KEY-----`;
  const b64 = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length,
  );
  const buf = str2buf(b64);
  const key = await crypto.subtle.importKey(
    "pkcs8",
    buf,
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,
    ["sign"],
  );
  return key;
}

// string -> velify public Key
export async function str2vrfyPubKey(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
  const pemFooter = "\n-----END PUBLIC KEY-----";
  const b64 = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length,
  );
  const buf = str2buf(b64);
  const key = await crypto.subtle.importKey(
    "spki",
    buf,
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,
    ["verify"],
  );
  return key;
}
