//
//
//

// 純粋な SHA256 ハッシュ関数 string -> Uint8Array
export async function hashOf(str: string): Promise<Uint8Array> {
  const uint8Ary = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    uint8Ary,
  );
  const hashUint8Ary = new Uint8Array(hashBuffer);
  return hashUint8Ary;
}

// Hex文字列を返す SHA256 ハッシュ関数 string -> string
export async function hexHashOf(str: string): Promise<string> {
  const uint8Ary = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    uint8Ary,
  );
  const hashUint8Ary = new Uint8Array(hashBuffer);
  const hashByteAry = Array.from(hashUint8Ary);
  const hashHex = hashByteAry.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return hashHex;
}
