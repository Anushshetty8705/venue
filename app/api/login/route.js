import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("users");

    // Find user by email
    const user = await collection.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json({ error: true, message: "User doesn't exist" });
    }

    // Check password
    if (body.password !== user.Password) {
      return NextResponse.json({ error: true, message: "Incorrect Password" });
    }

    // Success: return UUID for dynamic routing
    return NextResponse.json({
      error: false,
      message: "Login successful",
      adminUuid: user.id, // <-- use UUID from DB
      username: user.username,
      email: user.email
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({
      error: true,
      message: "Internal server error",
    });
  }
}
