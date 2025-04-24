import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import routes from "./routes/routes.js";
import authRoutes from "./routes/authRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'https://resume-tex.vercel.app',
    'http://localhost:5173',
    'https://resumeconvertorlatex.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition', 'Content-Length']
}));

mongoose.connect(process.env.URI).then(() => {
  console.log("Connected to MongoDB");
}
);
 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", routes);
app.use("/api", authRoutes);
app.use("/api", emailRoutes);
app.use("/api", jobRoutes);

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;