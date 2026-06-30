import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'; // Import the file system module to handle file operations like deleting temporary files, changing file permissions, etc.

// Configure Cloudinary with credentials from env

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//=============================================================================================================//

// Steps to upload file to Cloudinary

// 1. Validate local file path
// 2. Upload file to Cloudinary
// 3. Delete local file after successful upload
// 4. Return Cloudinary response
// 5. Handle errors and delete local file if upload fails

const uploadToCloudinary = async (localFilePath) => {
  try {

  //=============================================================================================================//

  // 1. Validate local file path

    if (!localFilePath) {
      console.error('File path is required for uploading to Cloudinary');
      return null; // Return null if the file path is not provided to indicate that the upload cannot proceed without a valid file path
    }

  //=============================================================================================================//

  // 2. Upload file to Cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)
    });

    // console.log('File uploaded to Cloudinary successfully, deleting local file present at:', response.url);

  //=============================================================================================================//

  // 3. Delete local file after successful upload
    
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }; // Delete the local file after successful upload to free up server storage space

  //=============================================================================================================//

  // 4. Return the response from Cloudinary which contains details about the uploaded file, including its URL, public ID, etc.
  
    return response;

  } catch (error) {

  //=============================================================================================================//

  // 5. Handle errors and delete local file if upload fails to ensure that temporary files do not accumulate on the server in case of upload failures

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }; // Ensure that the local file is deleted even if there is an error during upload
    console.error('Error uploading to Cloudinary:', error);

    return null; // Return null in case of an error to indicate that the upload was unsuccessful
  }
}


export {uploadToCloudinary};


