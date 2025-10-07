// import clientPromise from "@/lib/mongodb";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { adminUuid, name, date, endDate, timeSlot, amount, description } = body;

//     if (!adminUuid || !name || !date || !amount) {
//       return Response.json({ success: false, error: "⚠️ Missing required fields" });
//     }

//     const client = await clientPromise;
//     const db = client.db("Banquet");

//     // Find hall by adminUuid
//     const hall = await db.collection("Halls").findOne({ adminUuid });
//     if (!hall) {
//       return Response.json({ success: false, error: "⚠️ Hall not found" });
//     }

//     const bookingsCollection = db.collection(hall.name);

//     // Convert dates to Date objects
//     const newStart = new Date(date);
//     const newEnd = endDate ? new Date(endDate) : newStart;

//     // Fetch all existing offline bookings
//     const existingBookings = await bookingsCollection.find({ offline: "offline" }).toArray();

//     // Check conflicts
//     for (let booking of existingBookings) {
//       const existingStart = new Date(booking.date);
//       const existingEnd = booking.endDate ? new Date(booking.endDate) : existingStart;

//       // ✅ Only block if the same timeSlot on the same day exists
//       if (timeSlot && booking.timeSlot === timeSlot && newStart.getTime() === existingStart.getTime()) {
//         return Response.json({ success: false, error: `⚠️ Time slot "${timeSlot}" is already booked on ${date}` });
//       }

//       // ✅ Overlapping multi-day booking (for full-day or multi-day bookings)
//       if (!timeSlot && newStart <= existingEnd && newEnd >= existingStart) {
//         return Response.json({ success: false, error: `⚠️ Booking dates overlap with existing booking (${booking.name})` });
//       }
//     }

//     // ✅ Insert booking
//     await bookingsCollection.insertOne({
//       offline: "offline",
//       adminUuid,
//       name,
//       date: newStart,
//       endDate: endDate ? newEnd : null,
//       timeSlot: timeSlot || null,
//       amount,
//       description,
//       createdAt: new Date(),
//     });

//     // Return all offline bookings sorted by date
//     const newBookings = await bookingsCollection
//       .find({ adminUuid, offline: "offline" })
//       .sort({ date: 1 })
//       .toArray();

//     return Response.json({ success: true, data: newBookings });
//   } catch (err) {
//     console.error("❌ Error adding offline booking:", err);
//     return Response.json({ success: false, error: "Server error" });
//   }
// }
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

    const newStart = new Date(date);
    const newEnd = endDate ? new Date(endDate) : newStart;

    // Generate all dates in the new booking range
    const newBookingDates = [];
    for (let d = new Date(newStart); d <= newEnd; d.setDate(d.getDate() + 1)) {
      newBookingDates.push(new Date(d));
    }

    const existingBookings = await bookingsCollection.find({ offline: "offline" }).toArray();

    for (let booking of existingBookings) {
      const existingStart = new Date(booking.date);
      const existingEnd = booking.endDate ? new Date(booking.endDate) : existingStart;

      // Generate all dates of existing booking
      const existingDates = [];
      for (let d = new Date(existingStart); d <= existingEnd; d.setDate(d.getDate() + 1)) {
        existingDates.push(new Date(d));
      }

      // Check for any overlapping date
      for (let newDay of newBookingDates) {
        for (let existingDay of existingDates) {
          if (newDay.getTime() === existingDay.getTime()) {
            // Conflict found
            if (timeSlot && booking.timeSlot === timeSlot) {
              return Response.json({ success: false, error: `⚠️ Time slot "${timeSlot}" already booked on ${newDay.toISOString().slice(0,10)}` });
            } 
            if (timeSlot && !booking.timeSlot) {
              return Response.json({ success: false, error: `⚠️ Cannot book slot on ${newDay.toISOString().slice(0,10)}, full-day booking exists (${booking.name})` });
            }
            if (!timeSlot) {
              return Response.json({ success: false, error: `⚠️ Multi-day booking conflicts with existing booking (${booking.name}) on ${newDay.toISOString().slice(0,10)}` });
            }
          }
        }
      }
    }

    // Insert booking
    await bookingsCollection.insertOne({
      offline: "offline",
      adminUuid,
      name,
      date: newStart,
      endDate: endDate ? newEnd : null,
      timeSlot: timeSlot || null,
      amount,
      description,
      createdAt: new Date(),
    });

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
