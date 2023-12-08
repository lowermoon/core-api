const {LocalStorage} = require('node-localstorage')

const db = require('../dbconfig/index');
localStorage = new LocalStorage('./scratch');

const dotenv= require('dotenv');
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid') 
const { Op } = require('sequelize');
dotenv.config();

// Tables
const usersTable = require('../models/tables/usersTable');
const freelancerTable = require('../models/tables/freelancerTable');

// Functions
const {createUser,findUser, usernameConsumer, emailConsumer} = require('../models/functions/usersFunction');
const {createFreelancer,updateFreelancer,findFreelancer, usernameFreelancer, emailFreelancer} = require('../models/functions/freelancerFunction');
const createRecords  = require('../models/functions/createRecords');
const  {mailOptions,transporter}  = require('../middleware/email');




//login 
exports.loginUsers = async(req,res)=>{
  try{
    const {username, email,password}=req.body

    const user = await findUser(username,password);
    const freelancer = await findFreelancer(username,password)




    //checking if Consumer 
    if(user){
      const ID = user.consumerId
      const role = "consumer"
      console.log(role)
      console.log(ID)
      createRecords(ID,role)
      const token = jwt.sign({username},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
      return res.cookie('verifyToken',token,{
        httpOnly: true,
        maxAge: 24*60*60*1000,
        secure: true
      })
      .status(201).setHeader('Content-Type', 'application/json')
      //sending data to FE
      .json({
        status: "success",
        message: "",
        data: {
          fullName: user.name,
          username: user.username,
          email: user.email,
          role: "consumer",
          point: user.specialPoint,
          level: user.level,
          token: token
        }
      });  
    }
      // if wrong username / password
    res.status(402).json({
      status: 'fail',
      message: 'password / username salah'})
      
  }catch(error){
    res.status(401).json({
      status: 'fail',
      message: error})
} 


}
//verify is the code same or not
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
      const consumerId = 'consumer_'+nanoid(20)
      createUser(
        consumerId,
        dataStorage.fullName,
        dataStorage.username,
        dataStorage.email,
        dataStorage.password,
        )
        return res.status(201).json({
          status: 'sucess',
          message: 'register successfully!',
          data:{
            fullName: dataStorage.fullName,
            username: dataStorage.username,
            email: dataStorage.email,
          }
        })
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
     
        exports.register = async (req,res)=>{
          try{
          const {fullName,username ,email,password}= req.body
          const dataStorage = {
            fullName : req.body.fullName,
            username : req.body.username,
            email : req.body.email,
            password : req.body.password,
          }; //save what user input into "data storage"
          const verificationCode = Math.floor(10000 + Math.random() * 90000); //for verification code
          const saveData = await jwt.sign({ dataStorage,verificationCode }, process.env.ACCESS_TOKEN_SECRET,{expiresIn: '120s'}); //save data storage and verification code into jwt with name "save data"
          res.cookie('saveData',saveData,{
            httpOnly: true,
            maxAge: 120000,
            secure: true,
            sameSite: 'none'
          })
        const usernameCheck = await usernameConsumer(username) //checking username Users
        const emailCheck= await emailConsumer(email) //then if username is not taken , then checking email if already taken then status fail        
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
          message: 'success register!',
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

