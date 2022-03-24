//
//
//

// ArrayBuffer -> string (base64)
export function buf2str(buf: ArrayBuffer): string {
  let binaryString = "";
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}

// string (base64) -> ArrayBuffer
export function str2buf(str: string): ArrayBuffer {
  const binary_string = atob(str);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
