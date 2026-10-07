import cloudinary from "./cloudinary.js";

const uploadCloudinary = (buffer) => { // buffer is stream data 
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "shopkart_products",
                resource_type: "image",
            },

            (error, result) => {
                if (error) {
                    reject(error);
                    return ;
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

export default uploadCloudinary;