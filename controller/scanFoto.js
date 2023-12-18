const { uploadPhoto } = require("../models/functions/uploadFunction");
const jwt = require('jsonwebtoken');
const freelancerTable = require("../models/tables/freelancerTable");
const axios = require('axios');
const { uploadVeriyFaceId } = require("../models/functions/photosFunction");

let number = 1

exports.scanFaceId = async (req,res)=>{
    try{
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
        if (!verifyToken) {
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        const file = req.files
        if(!file){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no file!'
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
            const findFreelancer = await freelancerTable.findOne({where: {username}})
            if(!findFreelancer){
                return res.status(404).json({
                    status: 'fail',
                    message: 'freelancer not found!'
                })
            }
        const client_id = findFreelancer.freelancer_id
        await uploadVeriyFaceId({client_id, file}).then(async response => {
            try {
                const responses = await axios.get(`https://face-recognition-n2fwioi52q-as.a.run.app/verify/${client_id}`) 
                    if(responses.data.prediction  < 20){
                        return res.status(200).json({
                            status: 'success',
                            message: 'face id verified!'       
                        })
                    } return res.status(400).json({
                        status: 'fail',
                        message: 'face id not match!!'       
                    })
            } catch (error) {
                return res.json({
                    status : 'fail',
                    message : error
                })
            }
        
        
    })
})

        

    
    }catch(err){
        return res.status(500).json({
            status: 'error',
            message: err
        })
    }
}