//
//
//

// deps
import { config } from "./deps.ts";

// in-mod
import { Flavor } from "./Flavor.ts";

/// 他のファイルからアクセスするためのデータ構造
type Env = {
  /// (任意 デフォルトはdebug) 実行環境 debug | prod
  FLAVOR: Flavor;
  /// (必須) Mongo Atlas に接続するAPIキー
  API_KEY: string;
  /// (必須) Mongo Atlas のAPIポイント
  API_POINT: string;
  /// (Deno Deployでのみ必須) 遠隔からの定期実行に必要なキー
  CRON_API_KEY: string;
};

/// env データを読み込む
export const env: Env = (() => {
  // 実行環境
  let flavor: Flavor = Flavor.debug;
  let CRON_API_KEY = Deno.env.get("CRON_API_KEY");
  let API_POINT = Deno.env.get("API_POINT");
  let API_KEY = Deno.env.get("API_KEY");
  // どこで実行されているか
  const deployId = Deno.env.get("DENO_DEPLOYMENT_ID");
  const denoDeploy = deployId !== undefined;
  if (denoDeploy) {
    // Deno Deploy
    flavor = Flavor.prod;
  } else {
    // Deno Deploy ではない
    flavor = Flavor.debug;
    CRON_API_KEY = "";
    // ローカルの .env ファイルから読み込む
    API_POINT = config({ path: "private/.env" })["API_POINT"]!;
    API_KEY = config({ path: "private/.env" })["API_KEY"]!;
  }
  // return
  return {
    FLAVOR: flavor,
    API_KEY: API_KEY!,
    API_POINT: API_POINT!,
    CRON_API_KEY: CRON_API_KEY!,
  };
})();
