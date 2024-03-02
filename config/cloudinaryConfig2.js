// config/cloudinaryConfig.js
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
    cloud_name: 'dtzwdn1jf', 
    api_key: '741567594763319', 
    api_secret: 'zQUzLn_BFPqVNcmbWG-WCsoNv0k' 
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'profilePicture',
      format: async (req, file) => 'png', // or other formats
      public_id: (req, file) => `property-${Date.now()}`, // Example to generate a unique ID    },
    },
  });
  

export { cloudinary, storage };
