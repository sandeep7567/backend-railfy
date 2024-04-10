import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();

dotenv.config({
  path: './.env'
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import healthRouter from './routes/health.routes';
import taskRouter from './routes/task.routes';
import historyRouter from './routes/history.routes';

//routes declaration
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/history", historyRouter);

// http://localhost:8000/api/v1/users/register

export { app }