const jsonStr = {
  "kty": "EC",
  "crv": "P-256",
  "x": "eiUUcmj2vZi5zTyq8x_9BjC-WtKBqw94voXyT1-gq08",
  "y": "OI6RGLgFi9V0uBV3zZn1rQtIJoksTC0PdXauQ6gJHfk",
};

const key = await window.crypto.subtle.importKey(
  "jwk",
  jsonStr,
  {
    name: "ECDSA",
    namedCurve: "P-256",
  },
  false,
  ["verify"],
);

const sig = [
  33,
  98,
  236,
  41,
  214,
  173,
  79,
  81,
  245,
  195,
  13,
  98,
  242,
  133,
  71,
  153,
  214,
  44,
  89,
  128,
  224,
  246,
  152,
  105,
  85,
  136,
  173,
  36,
  251,
  163,
  48,
  62,
  172,
  120,
  232,
  116,
  219,
  81,
  105,
  133,
  12,
  128,
  154,
  207,
  130,
  242,
  109,
  226,
  112,
  123,
  82,
  33,
  27,
  155,
  99,
  240,
  158,
  55,
  223,
  250,
  127,
  77,
  46,
  39,
];

const ary = new TextEncoder().encode("HeLLO");

console.log(ary);

let ok = await window.crypto.subtle.verify(
  {
    name: "ECDSA",
    hash: { name: "SHA-256" },
  },
  key,
  Uint8Array.from(sig),
  Uint8Array.from(ary),
);

console.log(ok);

// この3つが引数
// pub_jwk
// sig
// sig_content
// =>
// 戻り値
// bool
