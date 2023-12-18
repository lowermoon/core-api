const jwt = require('jsonwebtoken');
const createReport = require('../models/functions/reportFunction');
const freelancerTable = require('../models/tables/freelancerTable');
const usersTable = require('../models/tables/usersTable');
const reportTable = require('../models/tables/reportTable');


const reportingUsers = async (req,res) =>{
    try {
        const cookie = req.headers.cookie;
        if(!cookie){
            return res.status(401).json({
                status: 'failed',
                message: 'there is no cookie'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken='))
        .split('=')[1];
        const {username,reason} = req.body;
        if(!username || !reason){
            return res.status(400).json({
                status: 'failed',
                message: 'there is no username or reason'
            })
        }
        const findUser = await freelancerTable.findOne({where:{username}});
        if(!findUser){
            return res.status(404).json({
                status: 'failed',
                message: 'freelancer not found'
            })
        }
        if(!verifyToken){  
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        jwt.verify(verifyToken,process.env.ACCESS_TOKEN_SECRET,async (err,decoded)=>{
            if(err){
                return res.status(401).json({
                    status: 'failed',
                    message: err
                })
            }
            const username = decoded.username;
            const user = await usersTable.findOne({where:{username}});
            if(!user){
                return res.status(404).json({
                    status: 'failed',
                    message: 'user not found'
                })
            }
            const report_id = user.consumerId;
            const id = findUser.freelancer_id;
            const checkIf = await reportTable.findOne({where:{report_id,id}});
            if(!checkIf){
                const report = 1;
                await createReport(report_id,id,reason);
                await reportTable.increment({report},{where:{report_id,id}});
                return res.status(201).json({
                    status: 'success',
                    message: 'report successfully'
            })
            }


            if(checkIf.report >= 3){
                await reportTable.update({status:'banned'},{where:{report_id,id}})
                return res.status(200).json({
                    status: 'success',
                    message: 'user banned'
                })
            }
        if(checkIf.report >= 4){
            return res.status(400).json({
                status: 'failed',
                message: 'user already banned'
            })
        }
        const report = 1;
        await createReport(report_id,id,reason);
        await reportTable.increment({report},{where:{report_id,id}});
        return res.status(201).json({
            status: 'success',
            message: 'report successfully'
        })
    })
    } catch (error) {
        return res.status(500).json({
            status: 'success',
            mesasge: 'Internal Server Error' + error
        })
    }
}

module.exports = reportingUsers;