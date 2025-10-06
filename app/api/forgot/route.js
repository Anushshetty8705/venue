import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json({ error: true, message: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("users");

    const user = await collection.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json({ error: true, message: "User does not exist" }, { status: 404 });
    }

    await collection.updateOne(
      { email: body.email },
      { $set: { Password: body.password } } // Consider hashing passwords for security
    );

    return NextResponse.json({ error: false, message: "Password changed successfully" });

  } catch (error) {
    console.error("Password Update Error:", error);
    return NextResponse.json({
      error: true,
      message: "Internal server error",
    }, { status: 500 });
  }
}
