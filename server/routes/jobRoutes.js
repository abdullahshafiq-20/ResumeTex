import express from "express";
import { getJobs } from "../controllers/jobs/jobsController.js";

const jobRoutes = express.Router();

jobRoutes.get("/jobs", getJobs);

export default jobRoutes;