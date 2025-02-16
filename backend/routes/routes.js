import express from "express"
import { pdfUpload } from "../controllers/fileUpload.js"
import { cloudinaryConfig } from "../utils/cloudinary.js"
import { extractPdfData, ConvertLatex, convertJsonTexToPdf } from "../controllers/logic.js"
import {proxyPdf} from "../controllers/proxyPdf.js"
import axios from "axios"
import { texContentUpload } from "../controllers/texFileUpload.js"
import { deleteFilesController } from '../controllers/deleteFile.js'
import { convertJsonTexToPdfLocally } from '../controllers/latexToPdf.js'

const router = express.Router();

cloudinaryConfig();
router.post("/upload-pdf", pdfUpload)
router.post("/extract-pdf", extractPdfData)
router.post("/convert-latex", ConvertLatex)
router.get("/proxy-pdf", proxyPdf)
router.post("/convert-json-tex-to-pdf", convertJsonTexToPdf)
router.post("/tex-content", texContentUpload)
router.post('/delete-files', deleteFilesController)
router.post('/convertJsonTexToPdfLocally', convertJsonTexToPdfLocally)



export default router