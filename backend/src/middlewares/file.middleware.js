import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
    //only accpept pdf and docx files
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'audio/webm',
            'audio/wav',
            'audio/mpeg',
            'audio/ogg'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only pdf, docx, and common audio files are allowed'), false);
        }
    }

});

export default upload;