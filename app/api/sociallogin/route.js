import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";
export async function POST(request) {
  const body = await request.json();
   const cilent = await clientPromise;
  const db = cilent.db("Banquet");
  const collection = db.collection("users");
   const user = await collection.findOne({
      email: body.email
    });
    if(user){
         return NextResponse.json({ error: false, message: "login" });
        
    }
   await collection.insertOne({
    username:body.username,
    email:body.email,
    AuthProvider:body.Authprovider ,
    id:uuidv4()
  });
   return NextResponse.json({ error: false, message: "new user" });
}