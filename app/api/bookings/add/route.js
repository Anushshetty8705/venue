// app/api/bookings/offline/route.js

import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      offline,
      adminUuid,
      name,
      date,      // start date
      endDate,   // end date for multi-day booking
      timeSlot,
      amount,
      description,
    } = body;

    if (!adminUuid || !name || !date || !amount) {
      return Response.json({ success: false, error: "⚠️ Missing required fields" });
    }

    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("Bookings");

    // Check for existing booking on single-day slot (start date)
    if (timeSlot) {
      const existingSlot = await collection.findOne({ adminUuid, date, timeSlot });
      if (existingSlot) {
        return Response.json({
          success: false,
          error: "⚠️ Slot already booked for start date",
        });
      }
    }

    // For multi-day bookings, check conflicts on both start and end dates
    if (endDate) {
      const startConflict = await collection.findOne({
        adminUuid,
        $or: [{ date }, { endDate: date }],
      });

      const endConflict = await collection.findOne({
        adminUuid,
        $or: [{ date: endDate }, { endDate }],
      });

      if (startConflict) {
        return Response.json({
          success: false,
          error: "⚠️ Start date conflicts with an existing booking",
        });
      }

      if (endConflict) {
        return Response.json({
          success: false,
          error: "⚠️ End date conflicts with an existing booking",
        });
      }
    }

    // Insert new booking
    const insertResult = await collection.insertOne({
      offline,
      adminUuid,
      name,
      date,
      endDate,
      timeSlot,
      amount,
      description,
      createdAt: new Date(),
    });

    const newBooking = await collection.findOne({ _id: insertResult.insertedId });

    return Response.json({ success: true, data: newBooking });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: "Server error" });
  }
}
