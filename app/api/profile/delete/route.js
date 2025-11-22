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
    const usersCollection = db.collection("users");

    // Delete user first
    await usersCollection.deleteOne({ adminUuid });

    // Find hall (may not exist)
    const hall = await hallsCollection.findOne({ adminUuid });

    if (hall) {
      // Delete hall entry
      await hallsCollection.deleteOne({ adminUuid });

      // Drop hall booking collection (ignore if missing)
      const bookingsCollection = db.collection(hall.name);

      try {
        await bookingsCollection.drop();
      } catch (err) {
        // Ignore missing collection errors
      }
    }

    // Always return success — even if hall didn't exist
    return Response.json({
      success: true,
      message: "✅ Profile deleted successfully"
    });

  } catch (err) {
    console.error("❌ Error deleting profile:", err);
    return Response.json({ success: false, error: "Server error" });
  }
}
