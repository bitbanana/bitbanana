import { config } from "https://deno.land/x/dotenv/mod.ts";

// .env から
const API_POINT = config({ path: "./private/.env" })["API_POINT"];
const API_KEY = config({ path: "./private/.env" })["API_KEY"];
console.log(`.env API_POINT: ${API_POINT}`);

// 固定
const DATA_SOURCE = "Bitbanana";
const DATABASE = "bitbananaDB";
const BASE_URI =
  `https://data.mongodb-api.com/app/${API_POINT}/endpoint/data/beta`;

export class Collection<DocType> {
  constructor(public name: string) {}

  async findOne(filter: Object): Promise<DocType> {
    const method = "POST";
    const path = "/action/findOne";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const res = await fetch(BASE_URI + path, options);
    const resJson = await res.json();
    return resJson.document;
  }

  async findCustom(
    filter: Object,
    sort: Object,
    limit: number,
  ): Promise<DocType[]> {
    const method = "POST";
    const path = "/action/find";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
      sort: sort,
      limit: limit,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const res = await fetch(BASE_URI + path, options);
    const resJson = await res.json();
    return resJson.documents;
  }

  async find(filter: Object): Promise<DocType[]> {
    const method = "POST";
    const path = "/action/find";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const res = await fetch(BASE_URI + path, options);
    const resJson = await res.json();
    return resJson.documents;
  }

  async insertOne(doc: DocType): Promise<void> {
    const method = "POST";
    const path = "/action/insertOne";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      document: doc,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const _ = await fetch(BASE_URI + path, options);
  }

  public async insertMany(docs: DocType[]) {
    const method = "POST";
    const path = "/action/insertMany";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      documents: docs,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const _ = await fetch(BASE_URI + path, options);
  }

  async replaceOne(filter: object, doc: DocType): Promise<void> {
    const method = "POST";
    const path = "/action/replaceOne";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
      replacement: doc,
      upsert: true,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const _ = await fetch(BASE_URI + path, options);
  }

  async deleteMany(filter: object): Promise<void> {
    const method = "POST";
    const path = "/action/deleteMany";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const _ = await fetch(BASE_URI + path, options);
  }
}

function createOptions(method: string, query: string): any {
  // 送信情報
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "api-key": API_KEY,
    },
    body: query,
  };
  return options;
}
