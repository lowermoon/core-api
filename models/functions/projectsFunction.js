const { Op } = require("sequelize");
const db = require("../../dbconfig/index");
const projectsTable = require("../tables/projectsTable");
const { nanoid } = require("nanoid");
const activeProjectsTable = require("../tables/activeProjectsTable");
const offerProjectsTable = require("../tables/offerProjectsTable");

// --------------------------------------------------- PROJECTS TABLE FUNCTIONS
const newProject = async (data) => {
    const project_id = 'projects_'+nanoid(16);
    const { project_name, project_desc, user_id, deadline,project_category,imgUrl } = data;
    if(user_id === "") {
        return false;
    }

    // Checking if user is already post a project or not.
    // const result = await projectsTable.findOne({
    //     where: {
    //         user_id: user_id
    //     }
    // });
    // if(result){
    //     return true;
    // }


    // Make a new project data
    const newData = {
        project_id,
        project_name: project_name,
        project_desc: project_desc,
        user_id: user_id,
        deadline: deadline,
        project_category: project_category,
        imgUrl : imgUrl
    };
    await projectsTable.create(newData);
    return true;
};

const deleteProject = async (project_id) => {
    const isDataExist = await projectsTable.findOne({where: {project_id}})

    if(!isDataExist) {
        return false;
    }

    await projectsTable.destroy({ where: {project_id}})
    await offerProjectsTable.destroy({ where: {project_id}})
    await activeProjectsTable.destroy({ where: {project_id}})
    return true;
};

const searchProjectsAll = async () => {
    const result = await projectsTable.findAll();
    return result
}

const searchProjectsFilter = async (filter, value) => {
    if(filter == "project_id") {
        const result = await projectsTable.findAll({
            where: {
                project_id: {
                    [Op.substring]: value
                }
            }
        });
        return result;
    }else if(filter == "project_name") {
        const result = await projectsTable.findOne({
            where: {
                project_name: {
                    [Op.substring]: value
                }
            }
        });
        return result;
    }
}

const allProject = async () =>{
    try {
        const project = await projectsTable.findAll({
            attributes:["project_id","user_id","project_name","project_desc","deadline","project_category","imgUrl"],
        })
        const newData = await Promise.all(project.map(async (item) => {
            const offer = await offerProjectsTable.findAll({
                where: {
                    project_id: item.project_id
                }
            })
            const active = await activeProjectsTable.findAll({
                where: {
                    project_id: item.project_id
                }
            })
            return {
                ...item.dataValues,
                offer: offer.length,
                active: active && active.status == 'active' ? true : false 
            }
        }))
        return newData
    } catch (error) {
        throw error;
    }
}

const updateProjects = async (data) => {
    const { project_name, project_desc, project } = data;
}

const getProjectById = async (project_id) => {
    try {
        const project = await projectsTable.findOne({
            where: {project_id},
            attributes:["project_id","user_id","project_name","project_desc","project_category","deadline"]
        });
        if(!project) {
            return false;
        }
        const offer = await offerProjectsTable.findAll({
            where: {
                project_id: project.project_id
            }
        });

        const active = await activeProjectsTable.findOne({
            where: {
                project_id: project.project_id
            }
        });

        const newData = {
            ...project.dataValues,
            offer: offer.length,
            active: active && active.status == 'active' ? true : false 
        };

        return newData;
    } catch (error) {
        throw error;
    }
}
// 


module.exports = {
    newProject,
    deleteProject,
    searchProjectsAll,
    searchProjectsFilter,
    allProject,
    getProjectById,
}
