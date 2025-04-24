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
import { googleAuth, googleCallback } from "../controllers/googleAuthController.js"
import { sendEmail, sendEmailWithAttachment } from "../controllers/emailController.js"
import { verifyToken } from "../middleware/auth.js"
import { getJobs } from "../controllers/jobsController.js"

const router = express.Router();

cloudinaryConfig();
router.post("/upload-pdf", pdfUpload)
router.post("/extract-pdf", extractPdfData)
router.post("/convert-latex", ConvertLatex)
router.get("/proxy-pdf", proxyPdf)
router.post("/tex-content", texContentUpload)
router.post('/delete-files', deleteFilesController)
router.post('/convertJsonTexToPdfLocally', convertJsonTexToPdfLocally)
router.post('/bugForm', bugForm)
router.get('/getCount', getCount)
router.get('/auth/google', googleAuth)
router.get('/auth/google/callback', googleCallback)
router.post('/send-email', verifyToken, sendEmail)
router.get('/jobs', getJobs)










export default router