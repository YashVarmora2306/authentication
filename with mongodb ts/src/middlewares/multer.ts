import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
})

export default upload;