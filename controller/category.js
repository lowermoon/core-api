const category = require("../models/tables/categoryTable");
const freelancerTable = require("../models/tables/freelancerTable");
const preference = require("../models/tables/preferenceTable");
const jwt = require("jsonwebtoken");

exports.getCategory = async (req, res) => {
    try {
        await category.findAll()
            .then((result) => {
                return res.status(200).json({
                    status: 'success',
                    message: 'get all category',
                    data: result
                })
            })
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error
        })
    }
}

exports.addPreference = async (req, res) => {
    try {
        const cookie = req.headers.cookie;
        if(!cookie){
            return res.status(404).json({
                status: 'error',
                message: 'please login first'
            })
        }
        const verifyToken = cookie
        .split('; ')
        .find(row => row.startsWith('verifyToken'))
        .split('=')[1];
        if(!verifyToken){
            return res.status(404).json({
                status: 'error',
                message: 'there is no token'
            })
        }
        const {MOBA,RPG,Horror,OpenWorld,Sports,Puzzle,FPS,BattleRoyal,Adventure} = req.body;
    
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {  
            if(err){
                return res.status(404).json({
                    status: 'error',
                    message: err
                })
            }
            const username = decode.username;
            const user = await freelancerTable.findOne({
                where: {
                    username: username
                }
            })
            if(!user){
                return res.status(404).json({
                    status: 'error',
                    message: 'user not found'
                })
            }
            const newData = {
                freelancer_id : user.freelancer_id,
                MOBA: MOBA ? 5 : Math.floor(Math.random() * 4 + 1),
                RPG: RPG ? 5 : Math.floor(Math.random() * 4 + 1),
                Horror: Horror ? 5 : Math.floor(Math.random() * 4 + 1),
                OpenWorld: OpenWorld ? 5 : Math.floor(Math.random() * 4 + 1),
                Sports: Sports ? 5 : Math.floor(Math.random() * 4 + 1),
                Puzzle: Puzzle ? 5 : Math.floor(Math.random() * 4 + 1),
                FPS: FPS ? 5 : Math.floor(Math.random() * 4 + 1),
                BattleRoyal: BattleRoyal ? 5 : Math.floor(Math.random() * 4 + 1),
                Adventure: Adventure ? 5 : Math.floor(Math.random() * 4 + 1)
            }
            await preference.create(newData).then((result) => {
                return res.status(200).json({
                    status: 'success',
                    message: 'category added',
                    result: result
                })
            })
            // return res.status(200).json({
            //     status: 'success',
            //     message: 'category added',
            //     result: newData
            // })
        })

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error
        })
    }
}