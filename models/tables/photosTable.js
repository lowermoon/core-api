const { DataTypes } = require("sequelize");
const db = require("../../dbconfig");

const photosTable = db.define('photos', {
    usersId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'https://storage.googleapis.com/skillshift-bucket/photos/defaultProfilePhoto.jpg'
    }
});
    


photosTable.sync().then(() => {
    console.log('Photos table is synced!')
});

db.sync().then(()=>{
    console.log('dataSkills sync!')
})
module.exports = photosTable;