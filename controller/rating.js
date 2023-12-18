const { alreadyRated, createRating } = require("../models/functions/rating")
const activeProjectsTable = require("../models/tables/activeProjectsTable")
const freelancerTable = require("../models/tables/freelancerTable")
const usersTable = require("../models/tables/usersTable")
const jwt = require('jsonwebtoken')
const ratingTable = require("../models/tables/ratingTable")


exports.ratingFreelancers = async (req,res) =>{
    try {
        const cookie = req.headers.cookie
        if(!cookie){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if (!verifyToken) {
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        const project_id = req.query.project_id
        const freelancer_id = req.query.freelancer_id
        const {rating,comment} = req.body
        if(!project_id || !freelancer_id){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no project id or freelancer id!'
            })
        }
        
        if(rating < 0 || rating > 5){
            return res.status(400).json({
                status: 'fail',
                message: 'rating must be 0-5!'
            })
        }
        const findProject = await activeProjectsTable.findOne({where: {project_id}})
        const findFreelancer = await freelancerTable.findOne({where: {freelancer_id}})
        if(!findProject || !findFreelancer){
            return res.status(404).json({
                status: 'fail',
                message: 'project / Freelancers not found!'
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
            if(!isSuccess){
                return res.status(404).json({
                    status: 'fail',
                    message: 'project not found!'
                })
            }
            if(isSuccess.project_status !== 'complete'){
                return res.status(406).json({
                    status: 'fail',
                    message: 'project not complete!'
                })
            }
            const isRating = await alreadyRated(freelancer_id,user_id)
            if(isRating){
                return res.status(406).json({
                    status: 'fail',
                    message: 'u already rating this freelancer!'
                })
            }
            await createRating(
                freelancer_id,
                rating,
                comment,
                user_id,
                username
            )
            return res.status(200).json({
                status: 'success',
                message: 'success rating freelancer!',
                result:{
                    freelancer_id,
                    username,
                    rating,
                    comment,
                    user_id
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

exports.showAllRating = async (req,res) =>{
    try {
        const cookie = req.headers.cookie
        if(!cookie){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if (!verifyToken) {
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        const freelancer_id = req.query.freelancer_id
        if(!freelancer_id){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no freelancer id!'
            })
        }
        const findFreelancer = await freelancerTable.findOne({where: {freelancer_id}})
        if(!findFreelancer){
            return res.status(404).json({
                status: 'fail',
                message: 'freelancers not found!'
            })
        }
        const findRate = await ratingTable.findAll({attributes: ["username","rating","comment","user_id"],where: {freelancer_id}})
        if(!findRate){
            return res.status(404).json({
                status: 'fail',
                message: 'rating not found!'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'success get rating!',
            result: 
                findRate   
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error' + error
        })
    }
}

exports.totalRating = async (req,res) =>{
    try {
        const cookie = req.headers.cookie
        if(!cookie){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        if (!verifyToken) {
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        const freelancer_id = req.query.freelancer_id
        if(!freelancer_id){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no freelancer id!'
            })
        }
        const findFreelancer = await freelancerTable.findOne({where: {freelancer_id}})
        if(!findFreelancer){
            return res.status(404).json({
                status: 'fail',
                message: 'freelancers not found!'
            })
        }
        const findRate = await ratingTable.findAll({attributes: ["rating"],where: {freelancer_id}})
        if(!findRate){
            return res.status(404).json({
                status: 'fail',
                message: 'rating not found!'
            })
        }
        let total = 0
        findRate.forEach(sum => {
            total += sum.rating
        });
        const average = total/findRate.length
        res.status(200).json({
            status: 'success',
            message: 'success get total rating!',
            result: {
                totalRate : findRate.length,
                rate : average.toFixed(1) 
            }
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error' + error
        })

    }
}