//
//
//

// 出金(取引の結果)
export type Output = {
  // 取引後の所有者
  to: string;
  // 金額
  amount: number;
  // 取引仲介者への報酬
  fee: number;
};
