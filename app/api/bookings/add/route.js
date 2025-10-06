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

    // Find hall by adminUuid
    const hall = await db.collection("Halls").findOne({ adminUuid });
    if (!hall) {
      return Response.json({ success: false, error: "⚠️ Hall not found" });
    }

    const bookingsCollection = db.collection(hall.name);

    const startDate = new Date(date);
    const finalEndDate = endDate ? new Date(endDate) : startDate;

    // === 1️⃣ Check: Any overlap with multi-day bookings ===
    const multiDayConflict = await bookingsCollection.findOne({
      adminUuid,
      date: { $lte: finalEndDate },
      endDate: { $gte: startDate },
    });

    if (multiDayConflict) {
      return Response.json({
        success: false,
        error: `⚠️ Cannot book — dates overlap an existing multi-day booking (${multiDayConflict.date} → ${multiDayConflict.endDate})`,
      });
    }

    // === 2️⃣ Check: Any slot booking on any day of the requested period ===
    const slotConflict = await bookingsCollection.findOne({
      adminUuid,
      date: { $gte: startDate, $lte: finalEndDate },
      timeSlot: { $exists: true, $ne: null },
    });

    if (slotConflict) {
      return Response.json({
        success: false,
        error: `⚠️ Cannot book — a slot (${slotConflict.timeSlot}) is already booked on ${slotConflict.date}`,
      });
    }

    // ✅ If all checks pass — Insert booking
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

    // Return all offline bookings (sorted by date)
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
