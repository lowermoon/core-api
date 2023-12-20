const offerProjectsTable = require("../../models/tables/offerProjectsTable");

const offerProjects = async (
  project_id,
  user_id,
  project_name,
  freelancerName,
  offer_price,
  offer_desc,
  freelancerId,
  category,
  imgUrl
) => {
  try {
    offerProjectsTable.create({
      project_id,
      user_id,
      project_name,
      freelancerName,
      offer_price,
      offer_desc,
      freelancerId,
      project_category : category,
      imgUrl
    });
  } catch (error) {
    return console.log(error)
    throw error
    };
  
};

const allOfferProjects = async (project_id) => {
    try {
        const offerProjects = await offerProjectsTable.findAll({attributes: ['project_name','freelancerName','offer_price','offer_desc','project_category','imgUrl'],where: {project_id}});
        
        return offerProjects;
    } catch (error) {
        throw error;
    }
}

const findOffer = async (freelancer_id,project_id) => {
  try {
    const offerProject = await offerProjectsTable.findOne({ where: { freelancerId:freelancer_id } });
    return offerProject;
  } catch (error) {
    throw error
  }
}
const alreadyOffer = async (project_id,freelancerId) => {
  try {
    const offerProject = await offerProjectsTable.findOne({ where: { project_id,freelancerId } });
    return offerProject;
  } catch (error) {
    throw error
  }
}
module.exports = {
    offerProjects,
    allOfferProjects,
    findOffer,
    alreadyOffer
};
