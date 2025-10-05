import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUuid = searchParams.get("adminUuid");

    if (!adminUuid) {
      return NextResponse.json({ success: false, message: "adminUuid is required" });
    }

    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("Bookings");

    // Use .toArray() to get the actual documents
    const entries = await collection.find({ adminUuid: adminUuid, offline: "offline" }).toArray();

    return NextResponse.json({ success: true, error: "done", data: entries });
  } catch (err) {
    console.error("Error getting entries:", err);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
