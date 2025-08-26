import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { PORT } from "./config/serverConfig.js";

import userRouter from "./Routes/user.route.js";

dotenv.config();

const app = express();

// midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = () => {
  origin: "http//localhost:5173";
  credential: true;
};

connectDB();

app.use(cors(corsOptions));

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}`);
});
