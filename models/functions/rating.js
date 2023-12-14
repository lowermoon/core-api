const ratingTable = require("../tables/ratingTable");

exports.createRating = async (freelancer_id,rating,comment,user_id,username) => {
  await ratingTable.create({
    freelancer_id,
    rating,
    comment,
    user_id,
    username
  });
}

exports.alreadyRated = async (freelancer_id,user_id) => {
    try {
        const activeProject = await ratingTable.findOne({
        where: {freelancer_id,user_id}
        });
        return activeProject;
    } catch (error) {
        throw error
    }
}