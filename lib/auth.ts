import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient, ServerApiVersion } from "mongodb";

const globalForMongo = globalThis as unknown as { _mongo?: MongoClient };

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn("MONGODB_URI is not set in environment");
}

const client =
  globalForMongo._mongo ??
  new MongoClient(uri || "mongodb://localhost:27017", {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongo = client;
}

const db = client.db(process.env.MONGODB_DB || "rentara_db");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      // Default new registrations to 'customer' role
      role: { type: "string", defaultValue: "customer", input: false },
      phone: { type: "string", required: false },
      address: { type: "string", required: false },
    },
  },
  plugins: [nextCookies()],
});
