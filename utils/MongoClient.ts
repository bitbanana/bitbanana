//
//
//

// deps
import { env } from "../deps/env.ts";

// 固定
const DATA_SOURCE = "Bitbanana";
const DATABASE = "bitbananaDB";
const BASE_URI =
  `https://data.mongodb-api.com/app/${env.API_POINT}/endpoint/data/beta`;

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
    limit?: number,
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
    console.log(`DATABASE: ${DATABASE}, DATA_SOURCE ${DATA_SOURCE}`);
    console.log(`filter: ${filter}`);
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    console.log(`willfetch: ${queryJson}`);
    const res = await fetch(BASE_URI + path, options);
    console.log(
      `didfetch BASE_URI: ${BASE_URI + path}, res.status: ${res.statusText}`,
    );
    const resJson = await res.json();
    console.log(`resJson: ${resJson}`);
    const resText = res.text;
    console.log(`resText: ${resText}`);
    const anyDocs: any[] = resJson.documents;
    console.log(`anyDocs: ${anyDocs}`);
    for await (const anyDoc of anyDocs) {
      delete anyDoc._id;
    }
    return anyDocs;
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
    const anyDoc: any = doc;
    delete anyDoc._id;
    const method = "POST";
    const path = "/action/replaceOne";
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
      replacement: anyDoc,
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

  // min max を超える場合は操作をしない
  async increment(
    filter: any,
    fieldName: string,
    diff = 1,
    min = 0,
  ): Promise<void> {
    const method = "POST";
    const path = "/action/updateOne";
    const newObj: any = { $inc: {} };
    newObj.$inc[fieldName] = diff;
    if (diff < 0) {
      // 減らすとき
      // need 以上の場合のみ実行
      const need = min - diff;
      if (filter[fieldName] === undefined) {
        filter[fieldName] = {};
      }
      filter[fieldName]["$gte"] = need;
    }
    const upsert = (diff < 0) ? false : true; // 減らす時は false
    const query = {
      collection: this.name,
      database: DATABASE,
      dataSource: DATA_SOURCE,
      filter: filter,
      update: newObj,
      upsert: upsert,
    };
    const queryJson = JSON.stringify(query);
    const options = createOptions(method, queryJson);
    const res = await fetch(BASE_URI + path, options);
    const resJson = await res.json();
    if (resJson["modifiedCount"] === 0 && resJson["upsertedId"] === undefined) {
      // 更新されたレコードも、新規作成されたレコードもないとき
      throw new Error("ERR increment less than min");
    }
    return;
  }
}

function createOptions(method: string, query: string): any {
  // 送信情報
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "api-key": env.API_KEY,
    },
    body: query,
  };
  return options;
}
