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

const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://rentara-client.vercel.app";
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getBaseUrl(),
  trustedOrigins: [
    "https://rentara-client.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.BETTER_AUTH_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ].filter(Boolean) as string[],
  database: mongodbAdapter(db, { client }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
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
