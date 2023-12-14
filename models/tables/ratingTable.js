const {DataTypes} = require('sequelize');
const db = require('../../dbconfig');

const ratingTable = db.define('rating', {
    freelancer_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment:{
        type: DataTypes.STRING,
    },
    username : {
        type: DataTypes.STRING,
    },
    user_id: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
})

ratingTable.sync({alter:true}).then(()=>{
    console.log('rating table is synced!')
})

module.exports = ratingTable;