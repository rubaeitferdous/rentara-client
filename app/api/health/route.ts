import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    hasMongoUri: Boolean(process.env.MONGODB_URI),
    hasBetterAuthSecret: Boolean(process.env.BETTER_AUTH_SECRET),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    hasGoogleClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
    hasGoogleClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    hasApiUrl: Boolean(process.env.NEXT_PUBLIC_API_URL),
    apiUrl: process.env.NEXT_PUBLIC_API_URL || null,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || null,
    nodeEnv: process.env.NODE_ENV,
  });
}
