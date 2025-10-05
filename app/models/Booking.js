import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: "Hall" },
  hallName: String,
  type: { type: String, enum: ["slot", "multi"], required: true },
  date: String,
  slot: String,
  from: String,
  to: String,
  name: String,
  phone: String,
  status: { type: String, default: "pending" },
  owner: { type: String, default: "guest" } // guest/admin
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
