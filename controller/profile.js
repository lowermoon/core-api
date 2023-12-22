const {LocalStorage} = require('node-localstorage')
const db = require('../dbconfig/index')
localStorage = new LocalStorage('./scratch')
const auth = require('./auth/user/auth')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


// Tables
const usersTable = require('../models/tables/usersTable');
const freelancerTable = require('../models/tables/freelancerTable');
const skillsTables = require('../models/tables/skills')


// Functions
const {createUser,findUser,updateUser} = require('../models/functions/usersFunction');
const {createFreelancer,updateFreelancer,findFreelancer} = require('../models/functions/freelancerFunction');
const createSkills = require('../models/functions/createSkills')
const multer = require('multer')
const { uploadPhoto } = require('../models/functions/uploadFunction')
const { uploadNewFaceId } = require('../models/functions/photosFunction')
const photosTable = require('../models/tables/photosTable')
const { nanoid } = require('nanoid')

exports.profileUsers = async(req,res)=>{
  const { username } = req.params;
  const cookie = await req.headers.cookie;
  if(!cookie || !cookie.includes('verifyToken')){
    return res.status(400)
    .json({
      status:'fail',
      message: 'there is no cookie here!'
    })
  }
  const verifyToken = cookie
  .split('; ')
  .find(row => row.startsWith('verifyToken='))
  .split('=')[1];
  try {
    const user = await usersTable.findOne({ where: { username } }) 
    const freelancer = await freelancerTable.findOne({where: {username}});
    if (!verifyToken) {
      
      return res.status(404).json({
        status: 'fail',
        message: 'unauthorized!'
      });   
    }
    if(user){
      const usersId = user.consumerId
      const findPhoto = await photosTable.findOne({where: {usersId}})
      return res.status(200).json({
        name: user.fullName,
        username: user.username,
        email: user.email,
        specialPoint : user.specialPoint,
        level: user.level,
        role: 'consumer',
        profile: findPhoto.imgUrl
      });
    }
    if(freelancer){
      const usersId = freelancer.freelancer_id
      const findPhoto = await photosTable.findOne({where: {usersId}})
      return res.status(200).json({
          name : freelancer.fullName,
          username: freelancer.username,
          email: freelancer.email,
          EXP: freelancer.experiencePoint,
          level: freelancer.level,
          role: 'freelancer',
          profile : findPhoto.imgUrl
        });
      }
      if(!user || !freelancer){
       return res.status(404).json({ message: 'User tidak ditemukan!' });
      }
    } catch (error) {
      console.error(error); 
     return res.status(500).json({ 
        status: 'fail',
        message: 'Internal server error' });
    }
  };
  


  exports.profiles = async(req,res)=>{
    try {
      const cookie = await req.headers.cookie;
      if(!cookie || !cookie.includes('verifyToken')){
        return res.status(400)
        .json({
          status:'fail',
          message: 'there is no cookie here!'
        })
      }
      const verifyToken = cookie
      .split('; ')
      .find(row => row.startsWith('verifyToken='))
      .split('=')[1];
      
      if (!verifyToken) {
        return res.status(402).json({
          status: 'fail',
          message: 'unauthorized!'
        });
      }
      jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(404).json({
            status: 'fail',
            message: err
          });
        }
        const username = decoded.username
        const userConsumer = await usersTable.findOne({ where: { username } })
        const userFreelancer = await freelancerTable.findOne({ where: { username } })
        if (userConsumer) {
          const usersId = userConsumer.consumerId
          const photoUriConsumer = await photosTable.findOne({where: {usersId}})
          return res.json({
            name: userConsumer.fullName,
            username: userConsumer.username,
            email: userConsumer.email,
            role: 'consumer',
            point: userConsumer.specialPoint,
            profile : photoUriConsumer.imgUrl
          });
        }
        
        if (userFreelancer ) {
          const usersId = userFreelancer.freelancer_id
          const photoUriFreelancer = await photosTable.findOne({where: {usersId}})
          return res.json({
            name: userFreelancer.fullName,
            nationalId : userFreelancer.nationalId,
            username: userFreelancer.username,
            email: userFreelancer.email,
            telephoneNumber: userFreelancer.telephoneNumber,
            role: 'freelancer',
            profile : photoUriFreelancer.imgUrl
          });
        }
  
        // If no response has been sent, send a 404 response
        res.status(404).json({ message: 'User tidak ditemukan!' });
      });     
    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    }
  };


exports.updateProfile = async(req,res)=>{
  try {
    const {fullName,password,telephoneNumber,nationalId} = req.body;
    const cookie = await req.headers.cookie;
    if(!cookie || !cookie.includes('verifyToken')){
      return res.status(400)
      .json({
        status: 'fail',
        message: 'there is no cookie here!'
      })
    }
    const verifyToken = cookie
    .split('; ')
    .find(row => row.startsWith('verifyToken='))
    .split('=')[1];
  
    if (!verifyToken) {
      return res.status(402).json({
        status: 'fail',
        message: 'unauthorized!'
      });
    }



    jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(404).json({
          status : 'fail',
          message: err
        });
      }
      const username = decoded.username
      const userConsumer = await usersTable.findOne({ where: { username } })
      const userFreelancer = await freelancerTable.findOne({ where: { username } })

     const usernameCheck = await usersTable.findAll({where : {username}})

  

     if(usernameCheck.lenghth > 0){
      return res.status(401).json({
        status: 'fail',
        message: 'username already taken!'
      });
    }
      if(userConsumer){
        const hashedPassword = await bcrypt.hashSync(password,10)
        usersTable.update({fullName,password:hashedPassword,telephoneNumber,nationalId},
          {where: {username}});
           res.status(200).json({
            status:'success',
            message: 'update success!'
          })
      }
      if(userFreelancer){
        const hashedPassword = await bcrypt.hashSync(password,10)
        freelancerTable.update({fullName,password:hashedPassword,telephoneNumber,nationalId},
          {where:{username}}
          );
           res.status(200).json({
            status:'success',
            message: 'update success!'
          })
      }
  })
    } catch (error) {
      return res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    }
  };

  exports.addSkill = async(req,res)=>{
    try {
      const cookie = await req.headers.cookie;
      if(!cookie || !cookie.includes('verifyToken')){
        return res.status(400)
        .json({
          status: 'fail',
          message: 'there is no cookie here!'
        })
      }
      const verifyToken = cookie
      .split('; ')
      .find(row => row.startsWith('verifyToken='))
      .split('=')[1];
      const skills = req.body.skills
      
      if (!verifyToken) {
        return res.status(402).json({
          status: 'fail',
          message: 'unauthorized!'
        });
      }

    jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(404).json({
          status: 'fail',
          message: err
        });
      }
      const username = decoded.username
      const freelancer = await freelancerTable.findOne({where:{username}})
      const getId = freelancer.freelancer_id
      createSkills(getId,skills)
      res.status(202).json({
        status: 'success',
          message: 'Skill Successfully Add!',
          data: {
            skill: skills,
            id : getId
          }
        })
    })
  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error'
    });
  
  }
}

exports.getSkills = async(req,res)=>{
  try{
    const cookie = await req.headers.cookie
    if(!cookie || !cookie.includes('verifyToken')){
      return res.status(402)
      .json({
        status: 'fail',
        message: 'unauthorized!'
      })
    }
    const verifyToken = cookie
    .split('; ')
    .find(row => row.startsWith('verifyToken='))
    .split('=')[1];
    if(!verifyToken){
      return res.status(402)
      .json({
        status: 'fail',
        message: 'unauthorized!'
      })
    }
    jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'fail',
          message: err
        });
      }
      const username = decoded.username
      const freelancer = await freelancerTable.findOne({where:{username}})
      const freelancerId = freelancer.freelancer_id
      const getSkill = await skillsTables.findAll({attributes: ['freelancerId','skills'],where:{freelancerId}})
      if(getSkill){
        return res.status(202)
        .json({
          status:'success',
          message: 'successfully get skills!',
          data:{
            getSkill
          }
        })
      }
    })
  }catch(err){
    return res.status(500).json({
      status:'fail',
      message: 'Internal server error'
    })
  }
}

exports.uploadPhotoProfile = async (req, res) => {
  // Checking Cookie
  const {cookie} = await req.headers;
  if(!cookie || !cookie.includes('verifyToken')){
    return res.status(402)
    .json({
      status: 'fail',
      message: 'Unauthorized! You need to login first'
    })
  }
  const verifyToken = cookie
  .split('; ')
  .find(row => row.startsWith('verifyToken='))
  .split('=')[1];

  if(!verifyToken){
    return res.status(402)
    .json({
      status: 'fail',
      message: 'Unauthorized! You need to login first'
    })
  }

  // Checking the file if it is uploaded or not
  const file = req.file;
  if(!file) {
    return res.status(404).send({ message: "tidak ada file"})
  }

  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).send({ message: "Invalid file type. Only jpeg, png, and jpg files are allowed" });
  }

  // Verify JWT
  jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(402).json({
        status: 'fail',
        message: 'Unauthorized! It seems like you are not logged in, please log in first!'
      })
    }

    // Checking the role of the users
    const username = decoded.username;
    const user = await usersTable.findOne({ where: { username } });
    const freelancer = await freelancerTable.findOne({ where: { username } });

    // Make upload based on the role;
    if (user) {
      const role = 'users';
      const random = nanoid(3)
      const fileName = `photos_${role}_${user.consumerId}_${random}`;
      uploadPhoto({ target: role, fileName: fileName, file: file })
      .then(async response => {
        const {publicUrl} = response;
        await photosTable.update({imgUrl:publicUrl},{where:{usersId:user.consumerId}})
        return res.status(200).json({
          status: 'success',
          message: 'Photo successfully uploaded!',
          data: {
            imageUrl: publicUrl
          }
        })
      }).catch(error => {
        return res.status(400).json({
          status: 'fail',
          message: error.message
        });
      })
    }

    if(freelancer) {
      const role = 'freelancers';
      const random = nanoid(3)
      const fileName = `photos_${role}_${freelancer.freelancer_id}_${random}`;
      uploadPhoto({ target: role, fileName: fileName, file: file })
      .then(async response => {
        const {publicUrl} = response;
        await photosTable.update({imgUrl:publicUrl},{where:{usersId:freelancer.freelancer_id}})
        return res.status(200).json({
          status: 'success',
          message: 'Photo successfully uploaded!',
          data: {
            imageUrl: publicUrl
          }
        })
      }).catch(error => {
        return res.status(400).json({
          status: 'fail',
          message: error.message
        });
      })
    }
  })
}

exports.uploadNewFaceId = async (req, res) => {
  try {
    const {cookie} = await req.headers;
    if(!cookie || !cookie.includes('verifyToken')){
      return res.status(402)
      .json({
        status: 'fail',
        message: 'Unauthorized! You need to login first'
      })
    }
    const verifyToken = cookie
    .split('; ')
    .find(row => row.startsWith('verifyToken='))
    .split('=')[1];

    if(!verifyToken){
      return res.status(402)
      .json({
        status: 'fail',
        message: 'Unauthorized! You need to login first'
      })
    }

    

    const files = req.files;
    if(!files) {
      return res
      .status(404).json({
        status: 'fail',
        message: 'tidak ada file'
      })
    }

    jwt.verify(verifyToken, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
      if (error) {
        return res.status(402).json({
          status: 'fail',
          message: 'Unauthorized! It seems like you are not logged in, please log in first!'
        })
      }
  
      // Checking the role of the users
      const username = decoded.username;
      const freelancer = await freelancerTable.findOne({ where: { username } });
      if(!freelancer){
        return res.status(404).json({
          status: 'fail',
          message: 'freelancer not found!'
        })
      }
    const client_id = freelancer.freelancer_id
    await uploadNewFaceId({client_id, file: files}).then(response => {
      return res
      .json({
        message: response
      })
    })
  })

  } catch (error) {
    return res
    .json({
      error: error
    })
  }
}