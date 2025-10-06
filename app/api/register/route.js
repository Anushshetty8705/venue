import clientPromise from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  const body = await request.json();

  const cilent = await clientPromise;
  const db = cilent.db("Banquet");
  const collection = db.collection("users");
  const existingUser = await collection.findOne({ email: body.email });

  if (existingUser) {
    // Email already exists, do not create another user
    return Response.json({ error: "true", message: "Email exists" });
  }

  await collection.insertOne({
    username:body.username,
    email:body.email,
    Password:body.password ,
    image:"",
    adminUuid:uuidv4()
  });

  return Response.json({ error: "false", message: "Success" });
}
