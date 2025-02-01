import express from "express";
const app = express();
import cors from "cors";
import routes from "./routes/routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
    origin: 'https://resume-tex.vercel.app/',
    credentials: true
  }
));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;