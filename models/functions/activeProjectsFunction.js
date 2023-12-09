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
