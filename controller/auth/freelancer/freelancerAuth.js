const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid') 
const dotenv= require('dotenv');

const {createFreelancer,updateFreelancer,findFreelancer, usernameFreelancer, emailFreelancer} = require('../../../models/functions/freelancerFunction');
const createRecords  = require('../../../models/functions/createRecords');
const  {mailOptions,transporter}  = require('../../../middleware/email');
const reportTable = require('../../../models/tables/reportTable');


dotenv.config();



exports.loginFreelancer = async(req,res)=>{
    try {
        const {username,email,password}=req.body
        const freelancer = await findFreelancer(username,password)
        if(!freelancer){
          return res.status(401)
            .json({
            status: "failed",
            message: "failed to login",
            data: {
              error: "username or password is wrong"
            }
          })
        }
        const checkStatus = await reportTable.findOne({where: {id:freelancer.freelancer_id}}) 
        if(!checkStatus && freelancer){
          
            const ID = freelancer.freelancer_id
            const role = "freelancer"
            
            const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '7d'})
            createRecords(ID,role)
            return res.cookie('verifyToken',token,{
              httpOnly: true,
              maxAge: 24*60*60*100000,
              secure: true  
            })
            .status(201).setHeader('Content-Type', 'application/json') 
            // sending the data to the FE
            
          .json({
          status: 'success',
          message: 'success login',
          result: {
          
                fullName: freelancer.name,
                username: freelancer.username,
                email: freelancer.email,
                role : "freelancer",
                EXP: freelancer.experiencePoint,
                level: freelancer.level, 
                token: token,
              }
            })
          }
            if(checkStatus.status == 'warning' && freelancer){

            const ID = freelancer.freelancer_id
            const role = "freelancer"
            const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
            createRecords(ID,role)
            return res.cookie('verifyToken',token,{
                httpOnly: true,
                maxAge: 24*60*60*1000,
                secure: true  
            })
            .status(201).setHeader('Content-Type', 'application/json') 
            // sending the data to the FE
            .json({
              status : 'success',
              message: `success login ,you got ${checkStatus.report} report`,
              result:{

                fullName: freelancer.name,
                username: freelancer.username,
                email: freelancer.email,
                role : "freelancer",
                EXP: freelancer.experiencePoint,
                level: freelancer.level, 
                status: checkStatus.status,
                report : checkStatus.report,
                token: token,
              }
              }); 
          }
        
        if(checkStatus.status == 'banned' && freelancer){
            return res.status(401).setHeader('Content-Type', 'application/json') 
            // sending the data to the FE
            .json({
              status: 'failed',
              message: 'this account get banned, cannot access!.',
              result:{
                fullName: freelancer.name,
                username: freelancer.username,
                email: freelancer.email,
                role : "freelancer",
                EXP: freelancer.experiencePoint,
                status: checkStatus.status
              }
              }); 
          }
            
        
           
    } catch (error) {
        res.status(400).json({
            status: "failed",
            message: "failed to login" + error,
            
        })
    }
}


exports.register = async (req,res)=>{
    try{
    const {fullName,username ,email,password,}= req.body
    const dataStorage = {
      fullName : req.body.fullName,
      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
    }; //save what user input into "data storage"
    const verificationCode = Math.floor(10000 + Math.random() * 90000); //for verification code
    const saveData = jwt.sign({ dataStorage,verificationCode }, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '120s'}); //save data storage and verification code into jwt with name "save data"
    res.cookie('saveData',saveData,{
      httpOnly: true,
      maxAge: 120000,
      secure: true,
      sameSite: 'none'
    })
    const usernameCheck = await usernameFreelancer(username)
    const emailCheck= await emailFreelancer(email) //if username is not taken , then checking email is already taken or not , if taken then status fail

  if (usernameCheck.length > 0) { //checking username if already taken then status fail
    return res.status(401).json({ 
      status: 'fail',
      message: 'username already taken!'
    });
  }
  if(emailCheck.length > 0){
    return res.status(401).json({
      status: 'fail',
      message: 'email already taken!'
    })
  }

// sending to mailOptions Function
 transporter.sendMail(await mailOptions(email,username,verificationCode),  (error, info) => {
  if (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({
      status: 'fail',
      message: 'Error sending email'});
  }
  return console.log("Message sent: %s", info.messageId);
});
  return res.status(202).json({
    status: 'success',
    message: 'successfully register',
    data:{
      username: username,
      code : verificationCode,
      token: saveData
    }
  }); 
}catch(err){
res.status(505).json({
status: 'fail',
message: err
})
}
}

exports.verify = async (req,res) => {
    try{
    const {userVerificationCode,email} = req.body
    const cookie = req.headers.cookie;
    if (!cookie) {
      return res.json({status: 'fail',message: 'fail'});
    }
    const data = cookie.split('=')[1];
    jwt.verify(data, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if(err){
      return res.status(404)
      .json({
        status: 'fail',
        message: err
      })
    }
    const dataStorage = decoded.dataStorage
    const verificationCode = decoded.verificationCode
    const parsedVerificationCode = parseInt(verificationCode);
    const parsedUserVerificationCode = parseInt(userVerificationCode);
    if(email !== dataStorage.email){
      return res.status(402).json({
        status: 'fail',
        message: 'email tidak sama!'
      })
    }
    if(parsedUserVerificationCode === parsedVerificationCode){
          const freelancer_id = 'freelancer_'+nanoid(20)
          createFreelancer(
            freelancer_id,
            dataStorage.fullName,
            dataStorage.username,
            dataStorage.email,
            dataStorage.password
            )
            return res.status(201).json({
              status: 'success',
              message: 'register successfully',
              data:{
                fullName: dataStorage.fullName,
                username: dataStorage.username,
                email : dataStorage.email,
                role: "freelancer",
              }
            });
        }
          return res.json({
            status: 'fail',
            message: 'your verification Code does not match!'})
          })
        }catch(err){
          return res.status(500)
          .json({
            status: 'fail',
            message: 'internal status error' + err
          })
        }
      }