/* eslint-disable no-useless-escape */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { config } from ".";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse> => {
  if (!buffer && !fileName) {
    throw new AppError(
      status.BAD_REQUEST,
      "FileName and Buffer Are Required But Not Present",
    );
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join("-")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) +
    "-" +
    Date.now() +
    "-" +
    fileNameWithoutExtension;

  const folder = extension === "pdf" ? "pdfs" : "images";

  return await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `NursingHome/${folder}`,
          public_id: `NursingHome/${folder}/${uniqueName}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(
                status.INTERNAL_SERVER_ERROR,
                "Failed To Upload File To Cloudinary",
              ),
            );
          } else {
            resolve(result as UploadApiResponse);
          }
        },
      )
      .end(buffer);
  });
};

export const deleteFileFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];

      await cloudinary.uploader.destroy(public_id, {
        resource_type: "image",
      });

      console.log(`File With publiv_id : ${public_id} Successfully Deleted`);
    }
  } catch (err: any) {
    console.log(err);
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed To Delete File From Cloudinary",
    );
  }
};

export const cloudinaryUpload = cloudinary;
