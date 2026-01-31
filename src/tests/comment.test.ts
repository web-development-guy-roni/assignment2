// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import request from "supertest";
import appPromise from "../app";
import mongoose from "mongoose";
import Comment from "../models/comment_model";
import User from "../models/user_model";

let app: any;

beforeAll(async () => {
    app = await appPromise;
    await Comment.deleteMany();
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Comment Tests", () => {
    test("Create Comment", async () => {
        const user = {
            username: "commentTestUser",
            email: "comment@test.com",
            password: "password123"
        };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;

        const loginRes = await request(app).post("/auth/login").send({
            email: user.email,
            password: user.password
        });
        const accessToken = loginRes.body.accessToken;

        const res = await request(app).post("/comment")
            .set("Authorization", "JWT " + accessToken)
            .send({
                comment: "This is a test comment",
                owner: userId,
                postId: "456"
            });
        expect(res.statusCode).toEqual(201);
    });

    test("Get all comments", async () => {
        const res = await request(app).get("/comment");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Get comment by ID", async () => {
        // Setup details
        const user = { username: "commentIdUser", email: "commentid@test.com", password: "password123" };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;
        const loginRes = await request(app).post("/auth/login").send({ email: user.email, password: user.password });
        const accessToken = loginRes.body.accessToken;

        // Create comment first
        const commentRes = await request(app).post("/comment")
            .set("Authorization", "JWT " + accessToken)
            .send({ comment: "CommentByID", owner: userId, postId: "123" });
        const commentId = commentRes.body._id;

        const res = await request(app).get(`/comment/${commentId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.comment).toEqual("CommentByID");
    });

    test("Get comments by Post ID", async () => {
        const user = { username: "commentPostUser", email: "commentpost@test.com", password: "password123" };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;
        const loginRes = await request(app).post("/auth/login").send({ email: user.email, password: user.password });
        const accessToken = loginRes.body.accessToken;

        await request(app).post("/comment")
            .set("Authorization", "JWT " + accessToken)
            .send({ comment: "CommentForPost", owner: userId, postId: "post123" });

        const res = await request(app).get("/comment/post/post123");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].postId).toEqual("post123");
    });

    test("Update comment", async () => {
        const user = { username: "updateComUser", email: "updatecom@test.com", password: "password123" };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;
        const loginRes = await request(app).post("/auth/login").send({ email: user.email, password: user.password });
        const accessToken = loginRes.body.accessToken;

        const commentRes = await request(app).post("/comment")
            .set("Authorization", "JWT " + accessToken)
            .send({ comment: "OriginalComment", owner: userId, postId: "123" });
        const commentId = commentRes.body._id;

        const res = await request(app).put(`/comment/${commentId}`)
            .set("Authorization", "JWT " + accessToken)
            .send({ comment: "UpdatedComment" });
        expect(res.statusCode).toEqual(200);
        expect(res.body.comment).toEqual("UpdatedComment");
    });

    test("Delete comment", async () => {
        const user = { username: "deleteComUser", email: "deletecom@test.com", password: "password123" };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;
        const loginRes = await request(app).post("/auth/login").send({ email: user.email, password: user.password });
        const accessToken = loginRes.body.accessToken;

        const commentRes = await request(app).post("/comment")
            .set("Authorization", "JWT " + accessToken)
            .send({ comment: "ToDelete", owner: userId, postId: "123" });
        const commentId = commentRes.body._id;

        const res = await request(app).delete(`/comment/${commentId}`)
            .set("Authorization", "JWT " + accessToken);
        expect(res.statusCode).toEqual(200);
    });
});