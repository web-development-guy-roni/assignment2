// Guy-Rozenbaum-214424814-Roni-Taktook-213207640
import request from "supertest";
import appPromise from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";

let app: any;

beforeAll(async () => {
    app = await appPromise;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("User Tests", () => {
    test("Delete user", async () => {
        const user = {
            username: "deleteUser",
            email: "delete@test.com",
            password: "password123"
        };
        const registerRes = await request(app).post("/auth/register").send(user);
        const userId = registerRes.body._id;

        // Login to get token
        const loginRes = await request(app).post("/auth/login").send({
            email: user.email,
            password: user.password
        });
        const accessToken = loginRes.body.accessToken;

        const res = await request(app).delete(`/user/${userId}`)
            .set("Authorization", "JWT " + accessToken);
        expect(res.statusCode).toEqual(200);
    });
});