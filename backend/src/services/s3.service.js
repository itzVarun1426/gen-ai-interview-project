import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const region = process.env.AWS_REGION || 'us-east-1';
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

let s3Client = null;
if (accessKeyId && secretAccessKey && bucketName) {
    s3Client = new S3Client({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
}

/**
 * Upload image buffer/file to S3 if configured, else save locally to /uploads.
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadToS3OrLocal(file) {
    if (!file) {
        throw new Error('No file provided for upload');
    }

    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    // Try AWS S3 if credentials are provided
    if (s3Client && bucketName) {
        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: `avatars/${filename}`,
                Body: file.buffer || fs.readFileSync(file.path),
                ContentType: file.mimetype || 'image/jpeg',
                ACL: 'public-read'
            });

            await s3Client.send(command);
            return `https://${bucketName}.s3.${region}.amazonaws.com/avatars/${filename}`;
        } catch (s3Err) {
            console.warn('AWS S3 Upload Warning (Falling back to local storage):', s3Err.message);
        }
    }

    // Fallback to local storage in public/uploads
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const localFilePath = path.join(uploadsDir, filename);

    if (file.buffer) {
        fs.writeFileSync(localFilePath, file.buffer);
    } else if (file.path) {
        fs.copyFileSync(file.path, localFilePath);
    }

    return `http://localhost:5000/uploads/${filename}`;
}
