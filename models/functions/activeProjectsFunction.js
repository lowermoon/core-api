const activeProjectsTable = require("../tables/activeProjectsTable");
const {Op} = require("sequelize");

exports.createActiveProjects = async function (
  project_id,
  user_id,
  project_name,
  project_desc,
  deadline,
  project_status,
  freelancer_id,
  freelancer_name,
  offer_price,
  category
) {
  await activeProjectsTable.create({
    project_id,
    user_id,
    project_name,
    project_desc,
    project_deadline:deadline,
    project_status,
    freelancer_id,
    freelancer_name,
    offer_price,
    project_category:category,
    
  });
};


exports.isActive = async (project_id) => {
  try {
    const activeProject = await activeProjectsTable.findOne({
      where: {
        project_id},project_status:{
      [Op.or] : ['active','pending_by_freelancer','pending_by_consumer']
    }
});
    return activeProject;
  } catch (error) {
    throw error
  }
}

exports.getProjectActive = async (project_id,freelancer_id) => {
  try {
    const activeProject = await activeProjectsTable.findOne({
      where: {project_id,freelancer_id}
    });
    return activeProject;
  } catch (error) {
    throw error
  }
}