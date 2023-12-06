const loggedRecord = require('../tables/loggedRecords');
const moment = require('moment-timezone');

let date = moment().tz("2023-12-06 0:34", "Asia/Jakarta")

const createRecords = async function (ID,role){
    loggedRecord.create({
        ID,
        role:role,
        loggedRecord: date
    })
}

module.exports = createRecords