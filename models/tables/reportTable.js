const db = require("../../dbconfig/index");
const { DataTypes } = require("sequelize");

const reportTable = db.define('report', {
    nomor:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
    },
    report_id:{
        type: DataTypes.STRING,
        allowNull: false
    },
    id:{
        type: DataTypes.STRING,
        allowNull: false
    },
    reason:{
        type: DataTypes.STRING,
        allowNull: false
    },
    report:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'warning'
    },
    date:{
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
});

reportTable.sync().then(() => {
    console.log('Report table is synced!');
})

module.exports = reportTable;