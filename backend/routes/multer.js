import multer from "multer";

const storage = multer.memoryStorage(); // or use diskStorage

export const singleUpload = multer({ storage }).single("avatar");
