import express from "express";
const app = express();
import cors from "cors";
import routes from "./routes/routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'https://resume-tex.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Disposition', 'Content-Length']
}));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;