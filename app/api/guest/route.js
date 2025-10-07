import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Banquet");
    const halls = await db.collection("Halls").find({}).toArray();
    return NextResponse.json({ success: true, data: halls });
  } catch (err) {
    console.error("Error loading halls:", err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
