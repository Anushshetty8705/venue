// app/api/halls/route.js

import clientPromise from "@/lib/mongodb";




export async function POST(request) {
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
    if (! adminUuid|| !name || !location || !capacity || !pricePerSlot || !priceFullDay || !email || !phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }
  

    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("Halls");
const  user=await collection.findOne({adminUuid:adminUuid})
  
if(user){
   return Response.json({ success: false,   error: "hall exsts"});
}

await collection.insertOne({
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
    });
const  newuser=await collection.findOne({adminUuid:adminUuid})
    return Response.json({ success: true, data:newuser,   error: "required fields"});
  } catch (err) {
    
    return Response.json({ success: false, message: "Server error",  error: "required " });
  }
}


