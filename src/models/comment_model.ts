// Guy-Rozenbaum-214424814-Roni-Taktook-213207640
import mongoose from "mongoose";

export interface IComment {
    comment: string;
    owner: string;
    postId: string;
}

const commentSchema = new mongoose.Schema<IComment>({
    comment: { type: String, required: true },
    owner: { type: String, required: true },
    postId: { type: String, required: true },
});

export default mongoose.model<IComment>("Comment", commentSchema);