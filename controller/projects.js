const { newProject, deleteProject, searchProjectsAll, searchProjectsFilter, allProject, getProjectById } = require ("../models/functions/projectsFunction");
const usersTable = require('../models/tables/usersTable')
const freelancerTable = require('../models/tables/freelancerTable')
const jwt = require('jsonwebtoken')
const projectsTable = require('../models/tables/projectsTable');
const { offerProjects, allOfferProjects, findOffer, alreadyOffer } = require("../models/functions/offerFunction");
const { createActiveProjects, isActive, getProjectActive } = require("../models/functions/activeProjectsFunction");
const offerProjectsTable = require("../models/tables/offerProjectsTable");
const activeProjectsTable = require("../models/tables/activeProjectsTable");
const { alreadyRated, createRating } = require("../models/functions/rating");
const photosTable = require("../models/tables/photosTable");
const categoryTable = require("../models/tables/categoryTable");


// CREATE READ UPDATE DELETE FOR PROJECTS TABLE
exports.newProjectHandler = async (req, res) => {
    try {
        const cookie = await req.headers.cookie;
        if (!cookie || !cookie.includes('verifyToken')) {
          return res.status(402).json({
            status: 'fail',
            message: 'unauthorized!'
          });
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
              return res.redirect('/');
            }
            const username = decoded.username
            const user = await usersTable.findOne({where: {username}})
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'u cannot access this!'
                })
            }
            if(user){
                const isBodyDefined = Object.values(req.body).every(value => typeof value !== "undefined");
                if(!isBodyDefined) {
                    return res
                    .status(404).json({status: "failed", message: "There's nothing to be requested in the body data!"})
                }
                const { project_name, project_desc, deadline,project_category } = req.body;

                if(!project_name || !project_desc || !deadline || !project_category ) {
                    return res
                    .status(404).json({status: "failed", message: "There's nothing to be requested in the body data!"})
                }
                const findImg = await photosTable.findOne({where: {usersId: user.consumerId}})
                const imgUrl = findImg.imgUrl
                const data = {
                    project_name: project_name,
                    project_desc: project_desc,
                    user_id: user.consumerId,
                    deadline: deadline,
                    project_category : project_category,
                    imgUrl
                };
                
                const ifSame = await projectsTable.findOne({where: {user_id: user.consumerId}})
                if(!ifSame){
                    await newProject(data);
                    return res.status(200).json({status: "success", message: "Success create a new project!", data: data});
                }
                if(data.project_name !== ifSame.project_name){
                    await newProject(data);
                    return res.status(200).json({status: "success", message: "Success create a new project!", data: data});       
                }
                } 
                return res.status(400).json({
                    status: 'fail',
                    message: 'you already create project!'
                })
        })
}catch(error){
    res.status(401).json({
      status: 'fail',
      message: error})
} 
}


exports.searchProjectsHandler =  async (req, res) => {
    const {by, value} = req.query;
    // Check if query is undefined!
    if(typeof by == "undefined") {
        return res
        .status(404).json({status: "failed", message: "You need to specify the filter!"})
    }

    if(by == "all"){
        const result = await searchProjectsAll();
        return res
        .status(200).json({status: "success", message: "Here's all the data!", data: result});
    }

    if(by == "project_name") {
        if(typeof value == "undefined" || !value) {
            return res
            .status(404).json({status: "failed", message: `You need to specify the value of the ${by}`});
        }

        const result = await searchProjectsFilter(by, value);
        return res
        .status(200).json({status: "success", message: "Here's the filtered data", data: result})
    }

    return res
    .status(404).json({status: "failed", message: "You need to specify filter data correctly!"});
}

exports.deleteProjectsHandler = async (req, res) => {
    const { project_id, user_id } = req.body;
    if(project_id == "" || user_id == "" || typeof project_id == "undefined" || typeof user_id == "undefined") {
        return res
        .status(404).json({status: "failed", message: "There's nothing to be requested in the body data!"});
    };
    const data = {
        project_id: project_id,
        user_id: user_id
    };
    const isProjectDeleted = await deleteProject(data);
    if(!isProjectDeleted) {
        return res
        .status(404)
        .json({status: "failed", message: "There's an error to delete the project, either it's project id or user's id", data: data});
    }
    return res
    .status(200).json({status: "success", message: "Deleting the project data is succeeded!", data: data});
}

exports.updateProjectsHandler = async (req, res) => {
    try {
    const cookie = req.headers.cookie
    if(!cookie || !cookie.includes('verifyToken')){
        return res.status(400).json({
            status: 'fail',
            message: 'there is no cookie there!'
        })
    }
    const verifyToken = cookie
    .split('; ')
    .find(row => row.startsWith('verifyToken='))
    .split('=')[1];
    if(!verifyToken){  
        return res.status(400).json({
            status: 'fail',
            message: 'unauthorized!'
        })
    }
    const { project_id, project_name, project_desc, deadline, project_category } = req.body;
    jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err){
            return res.status(404).json({
                status: 'fail',
                message: err
            })
        }
        const username = decoded.username
        const user = await usersTable.findOne({where: {username}})
        const result = await projectsTable.findOne({where: {project_id}});
        if(!result) {
            return res
            .status(404).json({status: "failed", message: "There's no project with that id!"});
        }
        if(result.user_id !== user.consumerId){
            return res.status(404).json({
                status: 'fail',
                message: 'u cannot access this!'
            })
        }
        if(project_id == "" || typeof project_id == "undefined") {
            return res
            .status(404).json({status: "failed", message: "There's nothing to be requested in the body data!"});
        };
        if(result.project_name == project_name ||result.project_desc == project_desc || result.project_category === project_category) {
            return res
            .status(404).json({status: "failed", message: "There's nothing to be updated in the body data!"});
        }
        await projectsTable.update({
            project_name,
            project_desc,
            deadline,
            project_category
        },{where:{project_id}})
        return res.status(200).json({
            status : 'success',
            message: 'success update project!'
        })
    })
    
} catch (error) {
    console.error(error);
    return res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
    })
}
}

exports.getAllProject = async (req,res) =>{
    try {
            const project = await allProject();
            if(project){
                return res.status(200)
                .json({
                    status: 'success',
                    message: 'success get all project',
                    result: {
                        project
                    }
                })
            }
            return res.status(404).json({
                status: 'fail',
                message: 'there is no project!'
            })
    } catch (error) {
        if(error){
            return res.status(500).json({
                status: 'fail',
                message: error
              });
        }
    }
}

exports.getProjectById = async (req,res) =>{
    try {
        const project_id = req.query.project_id
        if(!project_id){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no project id!'
            })
        }
        const project = await getProjectById(project_id);
        if(project){
            return res.status(200)
            .json({
                status: 'success',
                message: 'success get project',
                result: {
                    project,
                }
            })
        }
        return res.status(404).json({
            status: 'fail',
            message: 'project not found!'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })   
    }
}

exports.getAllProjectUser = async(req,res)=>{
    try {
        const cookie = req.headers.cookie;
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return res.status(404).json({
                    status: 'fail',
                    message: err
                })
            }
            const username = decoded.username
            const user = await usersTable.findOne({where: {username}})
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'user not found!'
                })
            }
            const user_id = user.consumerId
            const project = await projectsTable.findAll({where: {user_id}})
            if(project.length === 0){
                return res.status(404).json({
                    status: 'fail',
                    message: 'you not create project yet!'
                })
            }
            return res.status(200).json({
                status: 'success',
                message: 'success get all project',
                result: {
                    project,
                }
            })
            })

        
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        
        })
    }
}

exports.offerProject = async(req,res)=>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        const {offer_price,offer_desc} = req.body
        const project_id = req.query.project_id
        if(!project_id){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no project id!'
            })
        }
        const project = await projectsTable.findOne({where: {project_id}})
        if(!project){
            return res.status(404).json({
                status: 'fail',
                message: 'project not found!'
            })
        }

        
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return res.status(404).json({
                    status: 'fail',
                    message: err
                })
            }  
            const username = decoded.username
            const freelancer = await freelancerTable.findOne({where: {username}})
            if(!freelancer){
                return res.status(404).json({
                    status: 'fail',
                    message: 'freelancer not found!'
                })
            }
            const user_id = project.user_id
            const project_name = project.project_name
            const freelancerName = freelancer.username
            const freelancerId = freelancer.freelancer_id
            const category = project.project_category
            const activeProject = await isActive(project_id)
            const resultOffer = await alreadyOffer(project_id,freelancerId)
            if(resultOffer){
                return res.status(406).json({
                    status: 'fail',
                    message: 'u already offer this project!'
                })
            }
            if(!activeProject){
                const findImg = await photosTable.findOne({where: {usersId: freelancerId}})
                const imgUrl = findImg.imgUrl
                
                await offerProjects(
                    project_id,
                    user_id,
                    project_name,
                    freelancerName,
                    offer_price,
                    offer_desc,
                    freelancerId,
                    category,
                    imgUrl
                    )
                    
                    return res.status(200).json({
                        status: 'success',
                        message: 'success offer project'
                    })  
                }

            if(activeProject.project_status == 'active'){
            return res.status(406).json({
                status: 'fail',
                message: 'project already accepted!'
            })
        }
            if(activeProject.project_status == 'pending_by_freelancer' || activeProject.project_status == 'pending_by_users'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'project pending!'
                })
            }
            if(activeProject.project_status == 'complete'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'project already complete!'
                })
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error', error
        })
    }    
}

exports.getAllOffer = async(req,res)=>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const project_id = req.query.project_id  
        if(!project_id){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no project id!'
            })
        }
        const findProject = await projectsTable.findOne({where: {project_id}})
        if(!findProject){
            return res.status(404).json({
                status: 'fail',
                message: 'project not found!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        const project = await allOfferProjects(project_id)
        if(!project){
            return res.status(200).json({
                status: 'success',
                message: 'success get all offer',
                result: 'no offer'
            })
        }
        return res.status(200).json({
            status: 'success',
            message: 'success get all offer',
            result: {
                project
            }
        })
    } catch (error) {
        throw error   
    }
}

exports.getAllOfferByFreelancer = async(req,res)=>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return res.status(404).json({
                    status: 'fail',
                    message: err
                })
            }
            const username = decoded.username
            const user = await freelancerTable.findOne({where: {username}})
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'user not found!'
                })
            }
            const findOffer = await offerProjectsTable.findAll({where: {freelancerId: user.freelancer_id}})
            if(!findOffer){
                return res.status(402).json({
                    status: 'fail',
                    message: 'there is no offer!',
                })
            }
            return res.status(200).json({
                status: 'success',
                message: 'success get all offer',
                result: {
                    findOffer
                }
            })
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })
    }
}

exports.acceptOffer = async(req,res)=>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const project_id = req.query.project_id
        const freelancer_id = req.query.freelancer_id
        const price = req.query.price
        const findProject = await projectsTable.findOne({where: {project_id}})
        const findFreelancer = await freelancerTable.findOne({where: {freelancer_id}})
        if(!findProject || !findFreelancer){
            return res.status(404).json({
                status: 'fail',
                message: 'project or freelancer not found!'
            })
        }
        
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return res.status(404).json({
                    status: 'fail',
                    message: err
                })
            }  
            const username = decoded.username
            const user = await usersTable.findOne({where: {username}})
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'user not found!'
                })
            }
            const user_id = user.consumerId
            if(user_id !== findProject.user_id){
                return res.status(404).json({
                    status: 'fail',
                    message: 'u cannot access this!'
                })
            }
            const alreadyOffer = await activeProjectsTable.findOne({where: {freelancer_id,user_id}})
            if(alreadyOffer){
                return res.status(406).json({
                    status: 'fail',
                    message: 'you already accept this offer!'
                })
            }
            const offer = await findOffer(freelancer_id,project_id)
            
            const project_name = findProject.project_name;
            const offer_price = offer.offer_price;
            const project_desc = findProject.project_desc;
            const freelancer_name = offer.freelancerName;
            const deadline = findProject.deadline;
            const category = findProject.project_category;
            const project_status = 'active' 
            
            await createActiveProjects(
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
                )
            
            // await offerProjectsTable.destroy({where: {project_id,freelancerId:freelancer_id}})
            return res.status(200).json({
                status: 'success',
                message: 'success accept project',
                result : {
                    project_id,
                    user_id,
                    project_name,
                    project_desc,
                    deadline,
                    project_status,
                    freelancer_id,
                    freelancer_name,
                    category,
                    offer_price,
                }
            })  
        })
    } catch (error) {
        if(error){
            return res.status(500).json({
                status: 'fail',
                message: 'Internal server error' + error
            })
        }
    }
}

exports.cancelProjectbyFreelancer = async(req,res) =>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const project_id = req.query.project_id
        const findProject = await activeProjectsTable.findOne({where: {project_id}})
        if(!findProject){
            return res.status(404).json({
                status: 'fail',
                message: 'project not found!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return res.status(404).json({
                    status: 'fail',
                    message: err
                })
            }  
            const username = decoded.username
            const user = await freelancerTable.findOne({where: {username}})
            const freelancer_id = user.freelancer_id

            if(freelancer_id !== findProject.freelancer_id){
                return res.status(404).json({
                    status: 'fail',
                    message: 'u cannot access this!'
                })
            }
            if (ifPending.project_status == 'pending_by_freealncer'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'you already cancel these project ,need accepted by users!!'
                })
            }
            const ifPending = await activeProjectsTable.findOne({where: {project_id,freelancer_id}})
            if(ifPending.project_status == 'pending_by_users'){
                await activeProjectsTable.destroy({where: {project_id,freelancer_id}})
                return res.status(200).json({
                    status: 'success',
                    message: 'cancel project'
                })
            }
            const project_status = 'pending_by_freelancer'
            await activeProjectsTable.update({project_status},{where: {project_id,freelancer_id}})
            return res.status(200).json({
                status: 'success',
                message: 'project pending need to be accepted by users!',
            })  
        })
    } catch (error) {
        if(error){
            return res.status(500).json({
                status: 'fail',
                message: 'Internal server error' + error
            })
        }
    }
}
exports.cancelProjectbyUser = async(req,res) =>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const project_id = req.query.project_id
        const findProject = await projectsTable.findOne({where: {project_id}})
        if(!findProject){
            return res.status(404).json({
                status: 'fail',
                message: 'project not found!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return res.status(404).json({
                    status: 'fail',
                    message: err
                })
            }  
            const username = decoded.username
            const user = await usersTable.findOne({where: {username}})
            const user_id = user.consumerId
            if(!user_id){
                return res.status(404).json({
                    status: 'fail',
                    message: 'user not found!'
                })
            }
            if(user_id !== findProject.user_id){
                return res.status(404).json({
                    status: 'fail',
                    message: 'u cannot access this!'
                })
            }
            if(ifPending.project_status == 'pending_by_users'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'you already cancel these project ,need accepted by freelancer!!'
                })
            }
            // const findActiveProject = await getProjectActive(user_id)
            const ifPending = await activeProjectsTable.findOne({where: {project_id,user_id}})
            if(ifPending.project_status == 'pending_by_freelancer'){
                await activeProjectsTable.destroy({where: {project_id,user_id}})
                return res.status(200).json({
                    status: 'success',
                    message: 'project cancel!'
                })
            }
            const project_status = 'pending_by_users'
            await activeProjectsTable.update({project_status},{where: {project_id,user_id}})
            return res.status(200).json({
                status: 'success',
                message: 'project pending need to be accepted by freelancer!',
            })  
        })
    } catch (error) {
        if(error){
            return res.status(500).json({
                status: 'fail',
                message: 'Internal server error' + error
            })
        }
    }
}

exports.finishProjectByFreelancer = async(req,res)=>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const project_id = req.query.project_id
        const findProject = await activeProjectsTable.findOne({where: {project_id}})
        if(!findProject){
            return res.status(404).json({
                status: 'fail',
                message: 'project not found!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                return res.status(400).json({
                    status: 'fail',
                    mesage: err
                })
            }
            const username = decoded.username
            const user = await freelancerTable.findOne({where: {username}})
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'user not found!'
                })
            }
            const freelancer_id = user.freelancer_id
            if(freelancer_id !== findProject.freelancer_id){
                return res.status(404).json({
                    status: 'fail',
                    message: 'u cannot access this!'
                })
            }
            const status = await activeProjectsTable.findOne({where: {project_id,freelancer_id}})
            if(status.project_status == 'complete'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'project already complete!'
                })
            }
            if(status.project_status == 'pending_need_review'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'project pending need to be reviewed by users!'
                })
            }
            const project_status = 'pending_need_review'
            await activeProjectsTable.update({project_status},{where: {project_id,freelancer_id}})
            return res.status(200).json({
                status: 'success',
                message: 'project pending need to be reviewed by users!',
            })
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error' + error
        })
    }
}

exports.finishProjectByUser = async(req,res)=>{
    try {
        const cookie = req.headers.cookie
        if(!cookie || !cookie.includes('verifyToken')){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const project_id = req.query.project_id
        const freelancer_id = req.query.freelancer_id
        const findProject = await activeProjectsTable.findOne({where: {project_id}})
        const findFreelancer = await freelancerTable.findOne({where: {freelancer_id}})
        if(!findProject || !findFreelancer){
            return res.status(404).json({
                status: 'fail',
                message: 'project / Freelancers not found!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err,decoded)=>{
            if(err){
                return res.status(400).json({
                    status: 'fail',
                    message: err
                })
            }
            const username = decoded.username
            const user = await usersTable.findOne({where: {username}})
            if(!user){
                return res.status(404).json({
                    status: 'fail',
                    message: 'user not found!'
                })
            }
            const user_id = user.consumerId
            if(user_id !== findProject.user_id){
                return res.status(404).json({
                    status: 'fail',
                    message: 'u cannot access this!'
                })
            }
            const isSuccess = await activeProjectsTable.findOne({where: {project_id,freelancer_id,user_id}})
            if(isSuccess.project_status == 'complete'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'project already complete!'
                })
            }
            const project_status = 'complete'
            const experience = Math.floor(Math.random() * 200 ) + 100
            const point = Math.floor(Math.random() * 200 ) + 100
            await activeProjectsTable.update({project_status},{where: {project_id,freelancer_id,user_id}})
            await freelancerTable.increment({experiencePoint:experience},{where: {freelancer_id}})
            await usersTable.increment({specialPoint : point},{where: {consumerId:user_id}})
            return res.status(200).json({
                status: 'success',
                message: 'project complete!',
                result: {
                    specialPoint : point
                }
            })
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error' + error
        })
    }
}

// HANDLER FOR ACTIVE PROJECTS
