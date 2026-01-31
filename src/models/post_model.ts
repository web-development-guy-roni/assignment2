// Guy-Rozenbaum-214424814-Roni-Taktook-213207640
import mongoose from "mongoose";

export interface IPost {
    title: string;
    content: string;
    sender: string;
}

const postSchema = new mongoose.Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    sender: { type: String, required: true },
});

export default mongoose.model<IPost>("Post", postSchema);