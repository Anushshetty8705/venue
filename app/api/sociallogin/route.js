import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("users");

    let user = await collection.findOne({ email: body.email });

    if (user) {
      // Existing user → return UUID
      return NextResponse.json({
        error: false,
        message: "login",
        adminUuid: user.adminUuid,
        username: user.username,
        email: user.email,
      });
    }

    // New user → create and return UUID
    const newUser = {
      username: body.username,
      email: body.email,
      AuthProvider: body.Authprovider,
      adminUuid: uuidv4(),
    };

    await collection.insertOne(newUser);

    return NextResponse.json({
      error: false,
      message: "new user",
      adminUuid: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Social login error:", error);
    return NextResponse.json({ error: true, message: "Internal server error" });
  }
}
