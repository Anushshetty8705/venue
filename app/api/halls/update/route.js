// app/api/halls/route.js

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
   await collection.updateOne(
      { adminUuid: adminUuid },
      {
        $set: { name: name ,
        location: location,
        capacity: capacity,
        ac: ac,
        priceFullDay: priceFullDay,
        pricePerSlot: pricePerSlot,
        email: email,
        phone: phone,
        images: images,
        }
      }
    );
    const  user=await collection.findOne({adminUuid:adminUuid})

    return Response.json({ success: true, data: user, error: "updated" });
  } catch (err) {
    return Response.json({
      success: false,
      message: "Server error",
      error: "faled ",
    });
  }
}
