//
//
//

// 入金(取引のお金はどこから来るのか)
export type Input = {
  // タイムスタンプ
  time: string;
  // 取引前の所有者
  from: string;
  // 取引前の所有者の署名
  signature: string;
};
