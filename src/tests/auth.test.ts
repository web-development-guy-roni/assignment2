// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import request from "supertest";
import appPromise from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";

let app: any;
const testUser = {
    username: "testuser",
    email: "test@test.com",
    password: "password123"
};

beforeAll(async () => {
    app = await appPromise;
    await User.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth Tests", () => {
    test("Register User", async () => {
        const res = await request(app).post("/auth/register").send(testUser);
        expect(res.statusCode).toEqual(201);
    });

    test("Login User", async () => {
        const res = await request(app).post("/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });

    test("Logout User", async () => {
        // First login to get the tokens
        const loginRes = await request(app).post("/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });
        const refreshToken = loginRes.body.refreshToken;

        // Then logout
        const res = await request(app).post("/auth/logout").set("Authorization", "JWT " + refreshToken);
        expect(res.statusCode).toEqual(200);
    });

    test("Refresh Token", async () => {
        const loginRes = await request(app).post("/auth/login").send({
            email: testUser.email,
            password: testUser.password
        });
        const refreshToken = loginRes.body.refreshToken;

        const res = await request(app).post("/auth/refresh").set("Authorization", "JWT " + refreshToken);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("accessToken");
        expect(res.body).toHaveProperty("refreshToken");
    });
});