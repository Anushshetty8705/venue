import clientPromise from "@/lib/mongodb";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUuid = searchParams.get("adminUuid");
    if (!adminUuid) {
      return Response.json({ success: false, error: "⚠️ Missing adminUuid" });
    }

    const client = await clientPromise;
    const db = client.db("Banquet");
    const hallsCollection = db.collection("Halls");
    const user=db.collection("users")
    await user.deleteOne({id:adminUuid})
    const hall = await hallsCollection.findOne({ adminUuid });
    if (!hall) {
      return Response.json({ success: false, error: "⚠️ Profile not found" });
    }
    const bookingsCollection = db.collection(hall.name);
    await hallsCollection.deleteOne({ adminUuid });
    await bookingsCollection.drop();
    return Response.json({ success: true, message: "✅ Profile deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting profile:", err);
    return Response.json({ success: false, error: "Server error" });
  }
}
