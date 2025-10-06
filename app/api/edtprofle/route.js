
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUuid = searchParams.get("adminUuid");
    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("users");

    const entrie = await collection.findOne({adminUuid:adminUuid })
    return Response.json({ success: true,error:"done",data:entrie });
  } catch (err) {
    console.error("Error getting entries:", err);
    return Response.json({ success: false, message: "Server error" });
  }
}
