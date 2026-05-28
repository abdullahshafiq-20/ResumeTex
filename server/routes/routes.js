import express from "express"
import { pdfUpload } from "../controllers/fileUpload.js"
import { cloudinaryConfig } from "../utils/cloudinary.js"
import { extractPdfData } from "../controllers/extractPdfData.js"
import { ConvertLatex } from "../controllers/latexConversion.js"
import {proxyPdf} from "../controllers/proxyPdf.js"
import { texContentUpload } from "../controllers/texFileUpload.js"
import { deleteFilesController } from '../controllers/deleteFile.js'
import { convertJsonTexToPdfLocally, getCount } from '../controllers/latexToPdf.js'
import { bugForm } from "../controllers/bugForm.js"
import { recordSuccessfulCall } from "../middleware/rateLimiter.js"

const router = express.Router();

cloudinaryConfig();
router.post("/upload-pdf", pdfUpload)
router.post("/extract-pdf", extractPdfData)
router.post("/convert-latex", ConvertLatex, recordSuccessfulCall)
router.get("/proxy-pdf", proxyPdf)
router.post("/tex-content", texContentUpload)
router.post('/delete-files', deleteFilesController)
router.post('/convertJsonTexToPdfLocally', convertJsonTexToPdfLocally, recordSuccessfulCall)
router.post('/bugForm', bugForm)
router.get('/getCount', getCount)



export default router