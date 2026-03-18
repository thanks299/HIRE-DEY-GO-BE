import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../config/env.js";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - e.g. "image/png"
 * @param {object} options - Cloudinary upload options (folder, transformation, etc.)
 */
export const uploadToCloudinary = (buffer, mimetype, options = {}) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype.startsWith("image/") ? "image" : "raw";

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete a file from Cloudinary by its URL
 * @param {string} url - The secure_url returned from Cloudinary
 */
export const deleteFromCloudinary = async (url) => {
  // Extract public_id from URL
  // e.g. https://res.cloudinary.com/demo/image/upload/v123/folder/file.jpg
  //       → public_id = "folder/file"
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return;

  // Skip version segment (v123) if present
  const afterUpload = parts.slice(uploadIndex + 1);
  if (/^v\d+$/.test(afterUpload[0])) afterUpload.shift();

  const publicIdWithExt = afterUpload.join("/");
  const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension

  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
