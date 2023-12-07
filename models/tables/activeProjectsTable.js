const {DataType} = require('sequelize');
const db = require('../../dbconfig/index');

const activeProjectsTable = db.define('activeProjects', {
    project_id: {
        type: DataType.INTEGER,
        primaryKey: true,
    },
    user_id: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    project_name: {
        type: DataType.STRING,
        allowNull: false,
    },
    project_desc: {
        type: DataType.STRING,
        allowNull: false,
    },
    project_price: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    project_deadline: {
        type: DataType.DATE,
        allowNull: false,
    },
    project_status: {
        type: DataType.STRING,
        allowNull: false,
    },
    freelancer_id: {
        type: DataType.INTEGER,
        allowNull: false,
    },
    freelancer_name: {
        type: DataType.STRING,
        allowNull: false,
    },
    offer_price: {
        type: DataType.INTEGER,
        allowNull: false,
    },
})

activeProjectsTable.sync().then(() => {
    console.log('activeProjectsTable sync!')
})

module.exports = activeProjectsTable;