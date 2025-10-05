// // app/api/halls/route.js

// import clientPromise from "@/lib/mongodb";
// export async function POST(request) {
//   try {
//     const body = await request.json();
//      const {adminUuid } = body;

//     const client = await clientPromise;
//     const db = client.db("Banquet");
//     const collection = db.collection("Halls");
// const  user=await collection.findOne({adminUuid:adminUuid})

//     return Response.json({ success: true, data:user,   error: "summne fields"});
//   } catch (err) {
    
//     return Response.json({ success: false, message: "Server error",  error: "tamshe required " });
//   }
// }


import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUuid = searchParams.get("adminUuid");



    const client = await clientPromise;
    const db = client.db("Banquet");
    const collection = db.collection("Halls");

    const entrie = await collection.findOne({ adminUuid:adminUuid })
    return Response.json({ success: true,error:"done",data:entrie });
  } catch (err) {
    console.error("Error getting entries:", err);
    return Response.json({ success: false, message: "Server error" });
  }
}
