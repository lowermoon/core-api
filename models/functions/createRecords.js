const loggedRecord = require('../tables/loggedRecords');
const moment = require('moment-timezone')

const createRecords = async function (ID,role){
    let date = moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
    loggedRecord.create({
        ID,
        role:role
    })
}

module.exports = createRecords