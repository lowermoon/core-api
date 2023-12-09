const {DataTypes} = require('sequelize');
const db = require('../../config/db');

const ratingTable = db.define('rating', {
    freelancerId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    userId: { 
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

ratingTable.synnc().then(()=>{
    console.log('rating table is synced!')
})

module.exports = ratingTable;