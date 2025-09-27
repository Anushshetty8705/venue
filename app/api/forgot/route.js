import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongodb";
export async function POST(request) {
    try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("users");

    const user = await collection.findOne({
      email: body.email
    });
  if(user)
{  
   await  collection.updateOne({email:body.email} ,{$set:{Password:body.password}})
        return NextResponse.json({ error: false, message: " Password changed" });
     
    }
    return NextResponse.json({ error: true, message: "User don't exist" });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({
      error: true,
      message: "Internal server error",
    });
  }
}