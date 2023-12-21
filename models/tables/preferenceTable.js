const {DataTypes} = require('sequelize');
const db = require('../../dbconfig/index');

const preference = db.define('preference', {
    freelancer_id:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    MOBA :{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    RPG: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Horror : {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    OpenWorld:{
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Sports: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Puzzle: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    FPS: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    BattleRoyal: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Adventure: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
})

preference.sync().then(()=>{
    console.log('Preference table sync')
})

module.exports = preference;