const category = require("../models/tables/categoryTable");
const preference = require("../models/tables/preferenceTable");


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

exports.addCategory = async (req, res) => {
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

        if(MOBA === true || RPG === true || Horror === true || OpenWorld === true || Sports === true || Puzzle === true || FPS === true || BattleRoyal === true || Adventure === true){
            const newData = {
                MOBA: 5,
                RPG: 5,
                Horror: 5,
                OpenWorld: 5,
                Sports: 5,
                Puzzle: 5,
                FPS: 5,
                BattleRoyal: 5,
                Adventure: 5
            }
            await preference.create(newData).then((result) => {
                return res.status(200).json({
                    status: 'success',
                    message: 'add category',
                    data: result
                })
            })
            // const assignValue = (category) => category ? 5 : Math.floor(Math.random() * 10);
// const newData = {
//     MOBA: assignValue(MOBA),
//     RPG: assignValue(RPG),
//     Horror: assignValue(Horror),
//     OpenWorld: assignValue(OpenWorld),
//     Sports: assignValue(Sports),
//     Puzzle: assignValue(Puzzle),
//     FPS: assignValue(FPS),
//     BattleRoyal: assignValue(BattleRoyal),
//     Adventure: assignValue(Adventure)
// }
        jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {  
            if(err){
                return res.status(404).json({
                    status: 'error',
                    message: err
                })
            }
            const username = decode.username;
            const user = await usersTable.findOne({
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
            
        })
    }
    
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error
        })
    }
}