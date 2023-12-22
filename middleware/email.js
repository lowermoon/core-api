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
        <img src="https://storage.googleapis.com/skillshift-bucket/photos/Logo.png" alt="SkillShift" style="width: 200px;">
        <p style="font-size: 18px; color: #333;">Hello, ${username}</p>
        <div style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 5px;">
            <p style="margin-bottom: 10px; font-size: 16px; color: #333;">Your Verification Code:</p>
            <p style="font-size: 24px; font-weight: bold; color: #007bff;">${verificationCode}</p>
        </div>
        <p style="font-size: 14px; color: #6c757d;">Please don't reply to this email</p>
    `,
    };
}







module.exports = {mailOptions,transporter}