import multer from "multer"

const storage = multer.memoryStorage() ;// uses disk of computer 

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const fileFilter = (req, file, cb) => {
    // accept only genuine image types
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only valid image files (JPG, PNG, WEBP) are allowed'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    }
});

export default upload