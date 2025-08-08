import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable tanımlanmamış');
}

if (!process.env.DB_NAME) {
  throw new Error('DB_NAME environment variable tanımlanmamış');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Development ortamında global kullan ki her hot reload'da yeni connection açmasın
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Production ortamında
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

// Database instance'ı almak için helper function
export async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName);
}