import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (file, projectId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: `work-nest/project_${projectId}`,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result?.secure_url || !result.public_id || !result.resource_type) {
          return reject(new Error("Cloudinary returned an incomplete upload result"));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
      },
    );

    uploadStream.end(file.buffer);
  });
};
