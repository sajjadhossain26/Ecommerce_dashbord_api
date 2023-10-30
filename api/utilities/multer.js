import multer from "multer";

// multer Storage
const storage = multer.memoryStorage();

// muler for brand logo
export const brandLogo = multer({ storage }).single("logo");
