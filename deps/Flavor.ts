//
// enum
//

/// 接続先やスタブ使用を決める区分値
export const Flavor = {
  debug: "debug",
  prod: "prod",
} as const;

export type Flavor = typeof Flavor[keyof typeof Flavor];
