import multer from 'multer';

const upload = multer({
    storage:multer.memoryStorage(),
    limits:{fileSize: 5 * 1024 * 1024},
    //only accpept pdf and docx files
    fileFilter:(req, file, cb) => {
        if(file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only pdf and docx files are allowed'), false);
        }
    }

});

export default upload;