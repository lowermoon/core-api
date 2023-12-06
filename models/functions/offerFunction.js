const offerProjectsTable = require("../../models/tables/offerProjectsTable");

const offerProjects = async (
  project_id,
  user_id,
  offer_price,
  offer_desc,
  freelancerId
) => {
  try {
    offerProjectsTable.create({
      project_id,
      user_id,
      offer_price,
      offer_desc,
      freelancerId,
    });
  } catch (error) {
    return console.log(error)
    throw error
    };
  
};

module.exports = offerProjects;