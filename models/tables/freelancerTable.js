const { DataTypes } = require('sequelize');
const db = require('../../dbconfig/index');

const freelancerTable = db.define('freelancer', {
    nomor:{
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
    },
    freelancer_id:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    fullName:{
        type: DataTypes.STRING,
    },
    username:{
        type: DataTypes.STRING,
        unique: true
    },
    email:{
        type: DataTypes.STRING,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
    },
    telephoneNumber:{
        type: DataTypes.STRING,
    },
    nationalId:{
        type: DataTypes.STRING,
    },
    location:{
        type: DataTypes.STRING,
    },
    experiencePoint:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    socialMedia: {
        type: DataTypes.STRING,
    },
    CreditQ:{
        type: DataTypes.STRING,
        defaultValue: '0',
    }
});

freelancerTable.sync({alter:true}).then(() => {
    console.log('Freelancer table is synced!');
})

module.exports = freelancerTable;