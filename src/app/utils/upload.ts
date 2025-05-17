import fs from "fs";
import multer from "multer";
import path from "path";

const uploadPath = path.join(process.cwd(), "/uploads/");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname) || ".jpg";
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

export const upload = multer({ storage });
