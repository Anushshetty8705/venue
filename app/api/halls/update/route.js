import clientPromise from "@/lib/mongodb";

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      adminUuid,
      name,
      location,
      capacity,
      ac,
      pricePerSlot,
      priceFullDay,
      email,
      phone,
      images,
    } = body;

    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("Halls");

    // Find the hall document
    const hall = await collection.findOne({ adminUuid });
    if (!hall) {
      return Response.json({ success: false, message: "Hall not found" });
    }

    // Rename the old collection to the new hall name
    const oldCollectionName = hall.name;
    const newCollectionName = name;

    // Only rename if the name has changed
    if (oldCollectionName !== newCollectionName) {
      await db.collection(oldCollectionName).rename(newCollectionName);
    }

    // Update hall document
    await collection.updateOne(
      { adminUuid },
      {
        $set: {
          name,
          location,
          capacity,
          ac,
          priceFullDay,
          pricePerSlot,
          email,
          phone,
          images,
        },
      }
    );

    const updatedHall = await collection.findOne({ adminUuid });

    return Response.json({ success: true, data: updatedHall, message: "Updated" });
  } catch (err) {
    console.error(err);
    return Response.json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
}
