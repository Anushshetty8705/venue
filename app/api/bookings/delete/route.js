import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUuid = searchParams.get("adminUuid");
    const bookingId = searchParams.get("id"); // booking _id to delete

    if (!adminUuid || !bookingId) {
      return Response.json({ success: false, error: "⚠️ Missing adminUuid or id" });
    }

    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("Halls");
    const hall = await collection.findOne({ adminUuid });
    const bookingsCollection = db.collection(hall.name);

    // Delete booking directly
    const result = await bookingsCollection.deleteOne({
      _id: new ObjectId(bookingId),
      adminUuid,
    });

    if (result.deletedCount === 0) {
      return Response.json({ success: false, error: "⚠️ Booking not found" });
    }

    return Response.json({ success: true, message: "✅ Booking deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    return Response.json({ success: false, error: "Server error" });
  }
}
