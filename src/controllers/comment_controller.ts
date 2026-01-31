// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import { Request, Response } from "express";
import Comment, { IComment } from "../models/comment_model";
import { BaseController } from "./base_controller";

class CommentController extends BaseController<IComment> {
    constructor() {
        super(Comment);
    }

    async getByPostId(req: Request, res: Response) {
        try {
            const objs = await this.model.find({ postId: req.params.postId });
            res.status(200).json(objs);
        } catch (error) {
            res.status(400).json({ message: error });
        }
    }
}

export default new CommentController();