const photosTable = require("../tables/photosTable");

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