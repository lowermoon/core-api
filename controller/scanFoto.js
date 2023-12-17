const { uploadPhoto } = require("../models/functions/uploadFunction");
const jwt = require('jsonwebtoken');
const freelancerTable = require("../models/tables/freelancerTable");
const axios = require('axios')

let number = 1

exports.uploadFotoFreelancer = async (req,res)=>{
    try{

        const cookie = req.headers.cookie
        if(!cookie){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no cookie there!'
            })
        }
        const verifyToken = cookie.split('=')[1]
        if(!verifyToken){
            return res.status(400).json({
                status: 'fail',
                message: 'unauthorized!'
            })
        }
        const file = req.file
        if(!file){
            return res.status(400).json({
                status: 'fail',
                message: 'there is no file!'
            })
        }
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
        if(!allowedTypes.includes(file.mimetype)){
            return res.status(400).json({
                status: 'fail',
                message: 'file must be image!'
            })
        }
        jwt.verify(verifyToken,process.env.ACCESS_TOKEN_SECRET,async (err,decoded)=>{
            if(err){
                return res.status(400).json({
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
            const id = user.freelancer_id
            const clientId = `${id}_${number}`
            optionsFolder = 'face_id'
            options= 'verif_image'
            number++
            uploadPhoto({optionsFolder , target: 'freelancers',clientId ,options,fileName, file})
            .then(response =>{
                const {publicUrl} = response
                return res.status(200).json({
                    status: 'success',
                    message: 'file uploaded successfully',
                    result : {
                        publicUrl         
                    }
                })
            })
    })
    }catch(err){
        return res.status(500).json({
            status: 'error',
            message: err
        })
    }
}