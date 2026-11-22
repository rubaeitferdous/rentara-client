import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized: No active session" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET;
    if (!secret) {
      console.error("JWT_SECRET or BETTER_AUTH_SECRET is missing in environment variables");
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
    }

    const role = (session.user as { role?: string }).role || "customer";

    const token = jwt.sign(
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role,
      },
      secret,
      { expiresIn: "2h" }
    );

    return NextResponse.json({ token, role });
  } catch (err: any) {
    console.error("Token generation error:", err);
    return NextResponse.json({ message: "Failed to generate session token" }, { status: 500 });
  }
}
