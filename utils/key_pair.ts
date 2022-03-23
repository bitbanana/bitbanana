//
//
//

import { decode, encode } from "https://deno.land/std/encoding/base64.ts";
import { assert } from "https://deno.land/std@0.130.0/testing/asserts.ts";

// 鍵ペア
export async function createKeyPair(): Promise<CryptoKeyPair> {
  // OAEP = 暗号化と複合に使う場合に指定
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]), // = 2^16 + 0 + 2^0 = 65537 キリの良い素数
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"], // OAEP = 暗号化と複合なのでそのまま指定
  );
  return keyPair;
}

// ArrayBuffer -> string (base64)
function buf2str(buf: ArrayBuffer): string {
  let binaryString = "";
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}

// string (base64) -> ArrayBuffer
function str2buf(str: string): ArrayBuffer {
  const binary_string = window.atob(str);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// private Key -> string
export async function privateKey2str(key: CryptoKey): Promise<string> {
  // 1. key
  // pkcs8 = 秘密鍵のフォーマットに関する標準 RFC 5208
  // 2. buf
  const exported = await crypto.subtle.exportKey(
    "pkcs8",
    key,
  );
  // 3. str
  const str = buf2str(exported);
  // 4. b64
  const b64 = btoa(unescape(encodeURIComponent(str)));
  // 5. pem
  const pem = `-----BEGIN PRIVATE KEY-----\n${b64}\n-----END PRIVATE KEY-----`;

  return pem;
}

// string -> private Key
export async function str2privateKey(pem: string): Promise<CryptoKey> {
  // 1. pem
  const pemHeader = `-----BEGIN PRIVATE KEY-----\n`;
  const pemFooter = `\n-----END PRIVATE KEY-----`;
  // 2. b64
  const b64 = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length,
  );
  // 3. str
  const str = decodeURIComponent(escape(atob(b64)));
  // 4. buf
  const willImport = str2buf(str);
  // 5. key
  const key = await crypto.subtle.importKey(
    "pkcs8",
    willImport,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"],
  );
  return key;
}

// public Key -> string
export async function publicKey2str(key: CryptoKey): Promise<string> {
  // spki = 公開鍵のフォーマット標準
  const exported = await crypto.subtle.exportKey(
    "spki",
    key,
  );
  const str = buf2str(exported);
  const b64 = btoa(unescape(encodeURIComponent(str)));
  const pem = `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`;
  return pem;
}

// string -> public Key
export async function str2publicKey(pem: string): Promise<CryptoKey> {
  const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
  const pemFooter = "\n-----END PUBLIC KEY-----";
  const b64 = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length,
  );
  const str = decodeURIComponent(escape(atob(b64)));
  const willImport = str2buf(str);
  const key = await crypto.subtle.importKey(
    "spki",
    willImport,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  );
  return key;
}
