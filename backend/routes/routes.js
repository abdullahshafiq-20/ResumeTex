import express from "express"
import { pdfUpload } from "../controllers/fileUpload.js"
import { cloudinaryConfig } from "../utils/cloudinary.js"
import { extractPdfData} from "../controllers/logic.js"
import upload from "../utils/multer.js"

const router = express.Router();

cloudinaryConfig();
router.post("/upload-pdf", upload.single("pdf"), pdfUpload)
router.get("/extract-pdf", extractPdfData)

export default router