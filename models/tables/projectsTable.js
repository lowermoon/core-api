const { DataTypes } = require("sequelize");
const db = require("../../dbconfig");

const projectsTable = db.define('projects', {
    project_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    project_name: {
        type: DataTypes.STRING
    },
    project_desc: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.STRING
    },
    deadline: {
        type: DataTypes.DATE
    },
    project_category: {
        type: DataTypes.STRING
    }
});

projectsTable.sync({ alter: true }).then(() => {
    console.log('Projects table is synchronized!')
});

module.exports = projectsTable;