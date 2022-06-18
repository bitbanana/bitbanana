//
//
//

/// Stake: 抽選に参加しているバリデーター の応募金
export type Stake = {
  // バリデーターのアドレス
  addr: string;
  // 応募金 敷金みたいな感じで帰ってくる (後で上限付ける)
  token: number;
};
