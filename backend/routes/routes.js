import express from "express"
import { pdfUpload } from "../controllers/fileUpload.js"
import { cloudinaryConfig } from "../utils/cloudinary.js"
import { extractPdfData, ConvertLatex, convertJsonTexToPdf} from "../controllers/logic.js"
import {proxyPdf} from "../controllers/proxyPdf.js"
import upload from "../utils/multer.js"
import axios from "axios"
import { texContentUpload } from "../controllers/texFileUpload.js"

const router = express.Router();

cloudinaryConfig();
router.post("/upload-pdf", upload.single("resume"), pdfUpload)
router.post("/extract-pdf", extractPdfData)
router.post("/convert-latex", ConvertLatex)
router.get("/proxy-pdf", proxyPdf)
router.post("/convert-json-tex-to-pdf", convertJsonTexToPdf)
router.post("/tex-content", texContentUpload)



export default router