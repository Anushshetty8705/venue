import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // for normal login
  username: String,
  Authprovider: { type: String, default: "credentials" },
  role: { type: String, enum: ["admin", "guest"], default: "guest" }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
