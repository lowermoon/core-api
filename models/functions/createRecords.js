const loggedRecord = require('../tables/loggedRecords');
const moment = require('moment-timezone');

let date = moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
console.log(date)

const createRecords = async function (ID,role){
    loggedRecord.create({
        ID,
        role:role,
        loggedRecord: date
    })
}

module.exports = createRecords