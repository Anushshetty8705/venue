import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const { adminUuid, name, date, endDate, timeSlot, amount, description } = body;

    if (!adminUuid || !name || !date || !amount) {
      return Response.json({ success: false, error: "⚠️ Missing required fields" });
    }

    const client = await clientPromise;
    const db = client.db("Banquet");

    const hall = await db.collection("Halls").findOne({ adminUuid });
    if (!hall) return Response.json({ success: false, error: "⚠️ Hall not found" });

    const bookingsCollection = db.collection(hall.name);

    const startDate = new Date(date);
    const finalEndDate = endDate ? new Date(endDate) : startDate;

    // Conflict check
    const conflict = await bookingsCollection.findOne({
      adminUuid,
      $or: [
        { date: { $lte: finalEndDate }, endDate: { $exists: false }, timeSlot },
        { date: { $lte: finalEndDate }, endDate: { $gte: startDate }, timeSlot },
        { date: { $gte: startDate, $lte: finalEndDate }, endDate: { $exists: false }, timeSlot },
      ],
    });

    if (conflict) {
      return Response.json({
        success: false,
        error: "⚠️ Cannot book — slot/date overlaps existing booking",
      });
    }

    // Insert booking
    await bookingsCollection.insertOne({
      offline: "offline",
      adminUuid,
      name,
      date,
      endDate: endDate || null,
      timeSlot: timeSlot || null,
      amount,
      description,
      createdAt: new Date(),
    });

    // Return all offline bookings
    const newBookings = await bookingsCollection
      .find({ adminUuid, offline: "offline" })
      .sort({ date: 1 })
      .toArray();

    return Response.json({ success: true, data: newBookings });
  } catch (err) {
    console.error("❌ Error adding offline booking:", err);
    return Response.json({ success: false, error: "Server error" });
  }
}
