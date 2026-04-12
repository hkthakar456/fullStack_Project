import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'; // Import the file system module to handle file operations like deleting temporary files, changing file permissions, etc.

// Configure Cloudinary with credentials from env

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// This function uploads a file to Cloudinary and then deletes the local file after the upload is complete to free up server storage space. It also handles errors gracefully by ensuring that the local file is deleted even if the upload fails, and it returns null in case of an error to indicate that the upload was unsuccessful.

const uploadToCloudinary = async (localFilePath) => {
  try {

    if (!localFilePath) {
      console.error('File path is required for uploading to Cloudinary');
      return null; // Return null if the file path is not provided to indicate that the upload cannot proceed without a valid file path
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
    });

    // console.log('File uploaded to Cloudinary successfully, deleting local file present at:', response.url);

    fs.unlinkSync(localFilePath); // Delete the local file after successful upload to free up server storage space

    return response;

  } catch (error) {
    fs.unlinkSync(localFilePath); // Ensure that the local file is deleted even if there is an error during upload
    console.error('Error uploading to Cloudinary:', error);

    return null; // Return null in case of an error to indicate that the upload was unsuccessful
  }
}


export {uploadToCloudinary};