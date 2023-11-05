import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.v2.config({
  cloud_name: "dqnsevmgx",
  api_key: "243622522214831",
  api_secret: "lHtNOQ2vd4ZcekRu1aQ5K8SvSOg",
});

export const cloudUpload = async (req) => {
  // upload brand logo
  const data = await cloudinary.v2.uploader.upload(req.file.path);
  return data;
};

export const cloudUploads = async (path) => {
  // upload brand logo
  const data = await cloudinary.v2.uploader.upload(path);
  return data.secure_url;
};

export const cloudDelete = async (publicId) => {
  // upload brand logo
  const data = await cloudinary.v2.uploader.destroy(publicId);
};
