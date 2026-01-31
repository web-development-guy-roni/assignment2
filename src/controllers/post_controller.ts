// Guy-Rozenbaum-214424814-Roni-Taktook-213207640
import Post, { IPost } from "../models/post_model";
import createController from "./base_controller";

const postController = createController<IPost>(Post);

export default postController;