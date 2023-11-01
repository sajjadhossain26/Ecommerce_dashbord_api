// import multer from "multer";

// // multer Storage
// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + Math.round(Math.random() * 1000000) + file.fieldname);
//   },
// });

// // muler for brand logo
// export const brandLogo = multer({ storage }).single("logo");

import multer from "multer";

// multer Storage
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

// multer for brand logo
export const brandLogo = multer({ storage }).single("logo");
export const categoryPhoto = multer({ storage }).single("catPhoto");
