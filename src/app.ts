// Guy-Rozenbaum-214424814-Roni-Taktuk-213207640
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import postRoute from "./routes/post_route";
import commentRoute from "./routes/comment_route";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";

dotenv.config();

const appPromise = new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));

    const mongoUri = process.env.NODE_ENV === "test" ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

    mongoose.connect(mongoUri!).then(() => {
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // Swagger
        const swaggerOptions = {
            definition: {
                openapi: "3.0.0",
                info: { title: "Web Dev API", version: "1.0.0" },
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT",
                        },
                    },
                },
            },
            apis: ["./src/routes/*.ts"],
        };
        const specs = swaggerJsDoc(swaggerOptions);
        app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

        // Routes
        app.use("/post", postRoute);
        app.use("/comment", commentRoute);
        app.use("/auth", authRoute);
        app.use("/user", userRoute);

        resolve(app);
    }).catch((err) => reject(err));
});

export default appPromise;