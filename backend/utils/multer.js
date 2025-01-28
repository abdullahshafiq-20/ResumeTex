
import multer from "multer";

const storage = multer.diskStorage({
    destination: "./upload",
    filename: (req, file, cb) => {
        // console.log(file, "file")
        cb(null, `${new Date().getTime()} - ${file.originalname}`)
        // cb(true , false)  throw == >error
        // cb(false , true) ==> success
    },

})

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB in bytes
    },
});

export default upload
