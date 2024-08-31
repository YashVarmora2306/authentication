import cloudinary from "../config/cloudinary.js"


const handleUpload = async (fileBuffer) => {

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.secure_url);
                }
        )
        uploadStream.end(fileBuffer);
    })
}

export default handleUpload;