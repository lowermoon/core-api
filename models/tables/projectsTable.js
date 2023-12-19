const { DataTypes, Sequelize } = require("sequelize");
const db = require("../../dbconfig");

const projectsTable = db.define('projects', {
    project_id: {
        type: DataTypes.STRING,
        notNull: false
    },
    project_name: {
        type: DataTypes.STRING,
        notNull: false
    },
    project_desc: {
        type: DataTypes.STRING,
        notNull: false
    },
    user_id: {
        type: DataTypes.STRING,
        notNull: false
    },
    deadline: {
        type: DataTypes.DATEONLY,
        notNull: false
    },
    project_category: {
        type: DataTypes.ARRAY(Sequelize.TEXT),
        notNull: false
    },
    imgUrl : {
        type: DataTypes.STRING,
        notNull: false
    },
}, {
    timestamps: false
});

projectsTable.sync().then(() => {
    console.log('Projects table is synchronized!')
});

module.exports = projectsTable;