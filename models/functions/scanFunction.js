const { googleBucket } = require("../../config/googleStorage");


exports.uploadFoto = async ({ target, fileName, file }) => {
    return newPromise((resolve, reject) => {
        if(target !== 'freelancers'){
            return {
                status: 'fail',
                message: 'target must be users, freelancers'
            }
        }
        const fileBuffer = file.buffer;
        
        const fileUpload = googleBucket.file(`photos/${target}//${fileName}`);
        const blobStream = fileUpload.createWriteStream({
            metadata :{
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