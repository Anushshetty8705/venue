import mongoose from "mongoose";

const HallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  capacity: Number,
  ac: Boolean,
  pricePerSlot: Number,
  priceFullDay: Number,
  email: String,
  phone: String,
  images: [String], // base64 or URLs
}, { timestamps: true });

export default mongoose.models.Hall || mongoose.model("Hall", HallSchema);
