const loggedRecord = require('../tables/loggedRecords');
const moment = require('moment-timezone')

const createRecords = async function (ID,role){
    const moment = require('moment-timezone')
    let date = moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    loggedRecord.create({
        ID,
        role:role,
        loggedRecord:date
    })
}

module.exports = createRecords