const offerProjectsTable = require("../../models/tables/offerProjectsTable");

const offerProjects = async (
  project_id,
  user_id,
  freelancerName,
  offer_price,
  offer_desc,
  freelancerId
) => {
  try {
    offerProjectsTable.create({
      project_id,
      user_id,
      freelancerName,
      offer_price,
      offer_desc,
      freelancerId,
    });
  } catch (error) {
    return console.log(error)
    throw error
    };
  
};

const allOfferProjects = async (project_id) => {
    try {
        const offerProjects = await offerProjectsTable.findAll({attributes: ['freelancerName','offer_price','offer_desc'],where: {project_id}});
        return offerProjects;
    } catch (error) {
        throw error;
    }
}
module.exports = {
    offerProjects,
    allOfferProjects
};