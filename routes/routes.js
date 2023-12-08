const express = require ('express')
const auth = require('../controller/auth.js')
const verify = require('../middleware/verifyToken.js');
const profile  = require('../controller/profile.js');
const jwt = require('jsonwebtoken')

const  resetPassword  = require('../controller/resetPassword.js');
const freelancerTable = require('../models/tables/freelancerTable.js');
const usersTable = require('../models/tables/usersTable.js');
const projects = require('../controller/projects.js');
const { uploadFile } = require('../config/googleStorage.js');
const router = express.Router();

// ============================= GET ROUTER ========================================== //


router.get('/', async (req, res) => {
  res.status(202).json({
    status: 'sucess',
    message: 'API connected!'
  })
  });

  router.get('/home', verify.verificationToken);

router.get('/register',(req,res)=>{
    res.render('register')
})
router.get('/verify',(req,res)=>{
    res.render('verify')
  })
  router.get('/profile/:username',profile.profileUsers);
  router.get('/profile',profile.profiles);
  router.get('/forget',(req,res)=>{
    res.render('forget')
  })
  router.get('/dashboard',(req,res)=>{
      const cookie = req.cookies;
      if(!cookie.verifyToken){
          return res.redirect('/')
      }
      const data = {
          admin:true
      };
      res.render('home/dashboard',{data});
  })
  router.get('/logout',(req,res)=>{
      res.clearCookie('verifyToken');
      res.json({
          status: 'success',
          message: 'See You Later Nerd'})
  })
  router.get('/allProject',projects.getAllProject)
  router.get('/project/:project_id',projects.getProjectById)
  router.get('/allOffer/:project_id',projects.getAllOffer)
  
  
  //  ============================= POST ROUTER ========================================== //
  
  router.post('/register',auth.register)
  router.post('/verifyUser',auth.verify)
  router.post('/loginUsers', auth.loginUsers)
  router.all('/profile/edit',profile.updateProfile);
  router.post('/profile/uploadphoto', uploadFile.single('file'), profile.uploadPhotoProfile);
  router.post('/forget',resetPassword.forgetPassword);
  router.post('/forget/verify', resetPassword.verifyCode)
  router.post('/forget/verify/new', resetPassword.enterNewPassword)
  router.post('/addSkill',profile.addSkill);
  router.post('/newProject',projects.newProjectHandler)
  // router.post('/deleteProject',projects.deleteProjectsHandler)
  router.post('/offerProject/:project_id',projects.offerProject)
  router.get('/skills/get',profile.getSkills)
  
  router.put('/updateProject',projects.updateProjectsHandler)

  router.delete('/deleteProject', projects.deleteProjectsHandler)
  


module.exports = router;