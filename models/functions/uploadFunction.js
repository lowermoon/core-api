const { googleBucket } = require("../../config/googleStorage");

exports.uploadPhoto = async ({ target, fileName, file }) => {
    return new Promise((resolve, reject) => {

        if(target !== 'users' && target !== 'freelancers' && target !== 'projects'){
            return {
                status: 'fail',
                message: 'target must be users, freelancers, or projects'
            }
        }
        const fileBuffer = file.buffer;
    
        const fileUpload = googleBucket.file(`photos/${target}/${fileName}`);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });
        
        blobStream.on('error', (error) => {
            reject(error);
        })
    
        blobStream.on('finish', () => {
            const response = {
                status: 'success',
                message: 'file uploaded successfully',
                publicUrl: `https://storage.googleapis.com/${googleBucket.name}/photos/${target}/${fileName}`
            }
            resolve(response);
        })
    
        blobStream.end(fileBuffer);
    })
    
}