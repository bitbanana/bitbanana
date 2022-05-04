// .env から
const API_POINT = `data-xxxxx`;
const API_KEY = `xxxxxxxxxxxxxxxx`;

// データソース, DB, コレクション
const DATA_SOURCE = "xxxx";
const DATABASE = "xxxx";
const COLLECTION = "xxxx";

// 操作内容
const HTTP_METHOD = "POST";
const PATH = "/action/find";
const filter = { "id": "777" };
const query = {
  collection: COLLECTION,
  database: DATABASE,
  dataSource: DATA_SOURCE,
  filter: filter,
};
const queryJson = JSON.stringify(query);

// 送信情報
const options = {
  method: HTTP_METHOD,
  headers: {
    "Content-Type": "application/json",
    "api-key": API_KEY,
  },
  body: queryJson,
};

// 通信実行
const URI =
  `https://data.mongodb-api.com/app/${API_POINT}/endpoint/data/beta${PATH}`;
// const response = await fetch(URI, options);
// const result = await response.json();
