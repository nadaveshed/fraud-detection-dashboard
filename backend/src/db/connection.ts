import { MongoClient, type MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const g = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> };
  if (!g._mongoClientPromise) {
    client = new MongoClient(uri, options);
    g._mongoClientPromise = client.connect();
  }
  clientPromise = g._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

const DB_NAME = process.env.MONGODB_DB ?? "fraud_dashboard";
const COLLECTION = "transactions";

export async function getDb() {
  const c = await clientPromise;
  return c.db(DB_NAME);
}

export function getCollectionName() {
  return COLLECTION;
}

export async function ensureIndexes() {
  const db = await getDb();
  const col = db.collection(COLLECTION);
  await col.createIndex({ timestamp: 1 });
  await col.createIndex({ user_id: 1, timestamp: 1 });
}
