const loggedRecord = require('../tables/loggedRecords');


const createRecords = async function (ID,role){
    loggedRecord.create({
        ID,
        role:role
    })
}

module.exports = createRecords