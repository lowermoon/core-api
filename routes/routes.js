const express = require ('express')
const auth = require('../controller/auth/user/auth.js')
const authFreelancer = require('../controller/auth/freelancer/freelancerAuth.js')
const verify = require('../middleware/verifyToken.js');
const profile  = require('../controller/profile.js');
const jwt = require('jsonwebtoken')

const  resetPassword  = require('../controller/auth/user/resetPassword.js');
const freelancerResetPassword = require('../controller/auth/freelancer/freelancerForget.js');
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

  // query project_id
  router.get('/project',projects.getProjectById)
  
  // query project_id
  router.get('/allOffer',projects.getAllOffer)

  // query project_id & freelancer_id
  router.post('/acceptOffer',projects.acceptOffer)
  
  
  //  ============================= POST ROUTER ========================================== //
  

  // router buyer
  router.post('/loginUsers', auth.loginUsers)
  router.post('/register',auth.register)
  router.post('/verifyUser',auth.verify)
  router.post('/forget',resetPassword.forgetPassword);
  router.post('/forget/verify', resetPassword.verifyCode)
  router.post('/forget/verify/new', resetPassword.enterNewPassword)

  //router project
  router.post('/newProject',projects.newProjectHandler)
  router.put('/updateProject',projects.updateProjectsHandler)
  router.delete('/deleteProject', projects.deleteProjectsHandler)

  // router freelancer
  router.post('/loginFreelancer', authFreelancer.loginFreelancer)
  router.post('/registerFreelancer',authFreelancer.register)
  router.post('/verifyFreelancer',authFreelancer.verify)
  router.post('/forgetFreelancer', freelancerResetPassword.forgetPassword)
  router.post('/forgetFreelancer/verifyFL', freelancerResetPassword.verifyCode)
  router.post('/forgetFreelancer/verifyFL/new', freelancerResetPassword.enterNewPassword)

  //router skills
  router.post('/addSkill',profile.addSkill);
  router.get('/skills/get',profile.getSkills)

  //router edit profile
  router.all('/profile/edit',profile.updateProfile);

  router.post('/profile/uploadphoto', uploadFile.single('file'), profile.uploadPhotoProfile);
  
  // router.post('/deleteProject',projects.deleteProjectsHandler)

  //offer project
  
  // query project_id
  router.post('/offerProject',projects.offerProject)

  
  


module.exports = router;