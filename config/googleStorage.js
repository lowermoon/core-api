const { Storage } = require("@google-cloud/storage");
const multer = require("multer");

const privateKey = process.env.SERVICE_ACCOUNT_KEY;
const googleStorage = new Storage({
    projectId: process.env.PROJECT_ID,
    credentials: {
        private_key: privateKey.replace(/\\n/g, "\n"),
        client_email: process.env.SERVICE_ACCOUNT_EMAIL
    }
})
exports.googleBucket = googleStorage.bucket(process.env.GOOGLE_BUCKET_NAME);

const multerStorage = multer.memoryStorage();
exports.uploadFile = multer({ storage: multerStorage }) ;