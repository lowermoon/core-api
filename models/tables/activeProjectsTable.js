const {DataTypes} = require('sequelize');
const db = require('../../dbconfig/index');

const activeProjectsTable = db.define('activeProjects', {
    project_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_deadline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    freelancer_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    freelancer_name: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    offer_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    project_category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

activeProjectsTable.sync({alter:true}).then(() => {
    console.log('activeProjectsTable sync!')
})

module.exports = activeProjectsTable;