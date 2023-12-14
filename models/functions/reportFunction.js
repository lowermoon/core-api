const reportTable = require("../tables/reportTable");
const moment = require("moment-timezone");

const createReport = async (report_id, id, reason, status) =>{
    try {
        let date = moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")

        await reportTable.create({
          report_id,
          id,
          reason,
          report:0,
          date,
          status,
        });      
    } catch (error) {
        throw error;
    }
}

module.exports = createReport;