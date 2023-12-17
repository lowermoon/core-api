const photosTable = require("../tables/photosTable");
const { googleBucket } = require("../../config/googleStorage");

exports.uploadPhoto = async ({role, client_id, file}) => {
    return new Promise((resolve, reject) => {
        if(role !== 'users' && role !== 'freelancers'){
            reject({
                status: 'fail',
                message: 'role must be users or freelancers'
            })
        }

        const fileBuffer = file.buffer;
        const fileUpload = googleBucket.file(`photos/${role}/${client_id}/${client_id}`)
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject({
                status: 'fail',
                message: error
            });
        });

        blobStream.on('finish', () => {
            const response = {
                status: 'success',
                message: 'file uploaded successfully',
                publicUrl: `https://storage.googleapis.com/${googleBucket.name}/photos/${role}/${client_id}/${client_id}`
            }
            resolve(response);
        })

        blobStream.end(fileBuffer);
    })
}

exports.uploadNewFaceId = async ({client_id, file}) => {
    const response = [];
    await file.forEach(async (item, index) => {
        const fileBuffer = item.buffer;
        const fileUpload = googleBucket.file(`faceid/${client_id}/${client_id}_${index}`)
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: item.mimetype
            }
        });

        let response_stream = new Promise((resolve, reject) => {
            blobStream.on('error', (error) => {
                reject({
                    status: 'fail',
                    filename: item.originalname,
                    message: error
                })
            });
    
            blobStream.on('finish', () => {
                resolve({
                    status: 'success',
                    message: 'file uploaded successfully',
                    publicUrl: `https://storage.googleapis.com/${googleBucket.name}/faceid/${client_id}/base_image/${client_id}_${index}`
                })
            })
            blobStream.end(fileBuffer);
        })
        response.push(response_stream);
    })
    return Promise.all(response);
}

exports.updatePhoto = async (usersId, imgUrl) => {
    try {
        const photo = await photosTable.findOne({ where: { usersId } });
        if (!photo) {
            const newPhoto = await photosTable.create({ usersId, imgUrl });
            return newPhoto;
        }
        const updatedPhoto = await photosTable.update({ imgUrl }, { where: { usersId } });
        return updatedPhoto;
    } catch (error) {
        return error;
    }
}

exports.getPhoto = async (usersId) => {
    try{
        const photo = await photosTable.findOne({where: {usersId}});
        return photo;
    }catch(error){
        return error;
    }
}

