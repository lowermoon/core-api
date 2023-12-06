const { DataTypes, Sequelize } = require("sequelize");
const db = require("../../dbconfig/index");




const loggedRecords = db.define('loggedRecords',{
    nomor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    ID: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING,
    },
    loggedRecord: {
        type: DataTypes.STRING,
    }, 
},
{
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
})

loggedRecords.sync({alter: true}).then(()=>{
    console.log('skills has sync!')
})

module.exports = loggedRecords