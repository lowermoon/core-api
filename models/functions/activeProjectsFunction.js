const activeProjectsTable = require("../tables/activeProjectsTable");

exports.createActiveProjects = async function (
  project_id,
  user_id,
  project_name,
  project_desc,
  deadline,
  project_status,
  freelancer_id,
  freelancer_name,
  offer_price
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
    
  });
};


exports.isActive = async (project_id) => {
  try {
    const activeProject = await activeProjectsTable.findOne({where: {project_id}},{project_status:'active'});
    return activeProject;
  } catch (error) {
    throw error
  }
}