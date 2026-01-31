// Guy-Rozenbaum-214424814-Roni-Taktook-213207640
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshTokens: { type: [String], default: [] }
});

export default mongoose.model("User", userSchema);