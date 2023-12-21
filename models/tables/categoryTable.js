const {DataTypes} = require('sequelize');
const db = require('../../dbconfig/index');

const category = db.define('category', {
    CATEGORY :{
        type: DataTypes.STRING,
        allowNull: true,
    }
},{
    timestamps: false
})

category.sync({alter : true}).then(()=>{
    console.log('category table sync')
})

module.exports = category;
