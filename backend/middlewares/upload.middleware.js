import multer from "multer"

const storage = multer.memoryStorage() ;// uses disk of computer 

const fileFilter = (req, file, cb) => {
    // accept only images
    if(file.mimetype.startsWith('image/')){
        cb(null, true) // null means no error move forword 
    }else{
        cb(new Error('Only images are allowed'), false)
    }
}

const upload = multer({ 
    storage, 
    fileFilter ,
    limits:{
        filesize: 1024 * 1024 * 5 // 5mb
    }
}) ;

export default upload