import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUuid = searchParams.get("adminUuid");

    if (!adminUuid) {
      return NextResponse.json({ success: false, message: "Admin ID required" });
    }

    const body = await request.json();
    const { username, password, image } = body;

    const client = await clientPromise;
    const db = client.db("Banquet");
    const users = db.collection("users");

    // Build update object dynamically
    const updateData = { username, image }; // always update username and image
    if (password && password.trim() !== "") {
      updateData.Password = password; // only update password if provided
    }

    const result = await users.findOneAndUpdate(
      { adminUuid: adminUuid },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, data: result.value });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
