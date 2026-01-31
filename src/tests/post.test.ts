// Guy-Rozenbaum-214424814-Roni-Taktook-213207640
import request from "supertest";
import appPromise from "../app";
import mongoose from "mongoose";
import Post from "../models/post_model";
import User from "../models/user_model";

let app: any;

beforeAll(async () => {
    app = await appPromise;
    await Post.deleteMany();
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Post Tests", () => {
    test("Add new post", async () => {
        const user = {
            username: "postTestUser",
            email: "post@test.com",
            password: "password123"
        };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;

        const loginRes = await request(app).post("/auth/login").send({
            email: user.email,
            password: user.password
        });
        const accessToken = loginRes.body.accessToken;

        const res = await request(app).post("/post")
            .set("Authorization", "JWT " + accessToken)
            .send({
                title: "Test",
                content: "Content",
                sender: userId
            });
        expect(res.statusCode).toEqual(201);
    });

    test("Get all posts", async () => {
        const res = await request(app).get("/post");
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Get post by ID", async () => {
        // Create a post first
        const user = {
            username: "postByIdUser",
            email: "postid@test.com",
            password: "password123"
        };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;

        const loginRes = await request(app).post("/auth/login").send({
            email: user.email,
            password: user.password
        });
        const accessToken = loginRes.body.accessToken;

        const postRes = await request(app).post("/post")
            .set("Authorization", "JWT " + accessToken)
            .send({
                title: "Test Post By ID",
                content: "Content",
                sender: userId
            });
        const postId = postRes.body._id;

        const res = await request(app).get(`/post/${postId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("Test Post By ID");
    });

    test("Update post", async () => {
        // Create a post first
        const user = {
            username: "updatePostUser",
            email: "updatepost@test.com",
            password: "password123"
        };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;

        const loginRes = await request(app).post("/auth/login").send({
            email: user.email,
            password: user.password
        });
        const accessToken = loginRes.body.accessToken;

        const postRes = await request(app).post("/post")
            .set("Authorization", "JWT " + accessToken)
            .send({
                title: "Original Title",
                content: "Content",
                sender: userId
            });
        const postId = postRes.body._id;

        const res = await request(app).put(`/post/${postId}`)
            .set("Authorization", "JWT " + accessToken)
            .send({ title: "Updated Title" });
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toEqual("Updated Title");
    });
});