import express from "express";
const app = express();
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import routes from "./routes/routes.js";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import extensionRoutes from "./routes/extensionRoutes.js";
import statsRouter from "./routes/statsRoutes.js";
import prefRoutes from "./routes/prefRoutes.js";
import { initSocket } from './config/socketConfig.js';
import cronJob from "./services/cronJob.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  // origin: [
  //   'https://resume-tex.vercel.app',
  //   'http://localhost:5173',
  //   'https://resumeconvertorlatex.onrender.com',
  //   "http://127.0.0.1:5500",
  //   "chrome-extension://nmkjfhiijcdmegliknehipcaabmlmoaj",
  //   "https://www.linkedin.com"
  // ],
  origin: '*', // Allow all origins for development, change in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition', 'Content-Length']
}));

const server = http.createServer(app);
const io = initSocket(server);

mongoose.connect(process.env.URI).then(() => {
  console.log("Connected to MongoDB");
}
);
 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use("/api", routes);
app.use("/api", authRoutes);
app.use("/api", emailRoutes);
app.use("/api", jobRoutes);
app.use("/api", resumeRoutes);
app.use("/api", extensionRoutes);
app.use("/api", statsRouter);
app.use("/api", prefRoutes);
app.get("/", (req, res) => {
  res.status(200).json({ status: 'ok' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("Socket.IO is ready");
  cronJob();
});

export { io };

export default app;