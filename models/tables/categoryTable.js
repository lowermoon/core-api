const { DataTypes } = require("sequelize")
const db = require("../../dbconfig")


const categoryTable = db.define('category', {
    category:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: false
})

categoryTable.sync().then(()=>{
    console.log('category table is synced!')
})

module.exports = categoryTable;