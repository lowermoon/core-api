const offerProjectsTable = require("../../models/tables/offerProjectsTable");
const activeProjectsTable = require("../tables/activeProjectsTable");
const projectsTable = require("../tables/projectsTable");

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
        const offerProjects = await offerProjectsTable.findAll({attributes: ['project_id','project_name','freelancerName','user_id','offer_price','offer_desc','freelancerId','project_category','imgUrl'],where: {project_id}});
        const newData = await Promise.all(offerProjects.map(async (item) => {
          const active = await activeProjectsTable.findOne({
              where: {
                  user_id: item.user_id
              }
          })
          return {
              ...item.dataValues,
              active: active && active.status == 'active'  ? true : false 
          }
      }))

        return newData;
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
