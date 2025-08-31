import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { PORT } from "./config/serverConfig.js";

import userRouter from "./Routes/user.route.js";
import companyRoute from "./Routes/company.route.js";
import JobRoute from "./Routes/job.route.js";
import applicationRoute from "./Routes/application.route.js";

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

app.use(cors());

//Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", JobRoute);
app.use("/api/v1/application", applicationRoute);

app.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}`);

  // mongoDB
  connectDB();
});
