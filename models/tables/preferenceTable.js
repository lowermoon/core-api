const {DataTypes} = require('sequelize');
const db = require('../../dbconfig/index');

const preference = db.define('preference', {
    freelancer_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    MOBA :{
        type: DataTypes.STRING,
        allowNull: true,
    },
    RPG: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Horror : {
        type: DataTypes.STRING,
        allowNull: true,
    },
    OpenWorld:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    Sports: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Puzzle: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    FPS: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    BattleRoyal: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Adventure: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})

preference.sync().then(()=>{
    console.log('Preference table sync')
})

module.exports = preference;