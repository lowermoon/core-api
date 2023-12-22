const nodemailer = require('nodemailer');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile)
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_MASTER,
      pass: process.env.PASSWORD_MASTER,
    },
  });

const mailOptions = async(email,username,verificationCode)=>{
    return{
        from: '"Skill Shift" uppermoon1404@gmail.com',
        to: email,
        subject: "Verification Code",
        text: `Your verification code is : ${verificationCode}`,
        html: `
        <img src="https://storage.googleapis.com/skillshift-bucket/photos/Logo.png" alt="SkillShift" style="display: block; margin: 0 auto; width: 200px;">
        <br>Hai ${username}<br>
        <br>Your Verification code is <b>${verificationCode}<b></br>
        <br>
        <br>
        <hr>
        <br><a>Please don't reply to this email</a></footer>
        `,
    };
}







module.exports = {mailOptions,transporter}