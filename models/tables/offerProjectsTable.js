const {DataTypes } = require("sequelize");
const db = require("../../dbconfig/index");

const offerProjectsTable = db.define('offerProjects', {
    project_id: {
        type: DataTypes.STRING
    },
    project_name: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.STRING
    },
    freelancerName: {
        type: DataTypes.STRING
    },
    offer_price: {
        type: DataTypes.INTEGER
    },
    offer_desc: {
        type: DataTypes.STRING
    },
    freelancerId: {
        type: DataTypes.STRING
    }, 
    project_category:{
        type: DataTypes.STRING
    },
    imgUrl: {
        type: DataTypes.STRING
    }
});

offerProjectsTable.sync().then(() => {
    console.log('offerProjects table is synchronized!')
});


module.exports = offerProjectsTable;