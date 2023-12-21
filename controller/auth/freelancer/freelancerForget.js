const dotenv= require('dotenv');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const freelancerTable = require('../../../models/tables/freelancerTable');
const { transporter } = require('../../../middleware/email');
dotenv.config();

exports.forgetPassword = async (req, res) => {
  try{
    const email = req.body.email;
    const findEmail = await freelancerTable.findOne({ where: { email } });
    const verificationCode = Math.floor(10000 + Math.random() * 90000);
    const emailToken = jwt.sign({ email,verificationCode }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    res.cookie('emailToken', emailToken, {
        httpOnly: true,
        maxAge: 300000,
        secure: true,
    });

    // if email not exist!
    if(!findEmail){
        return res.status(402).json({
            status : 'fail',
            message: 'user tidak ditemukan'
        })
    }
    if(findEmail){
        let resetMailOptions = {
            from: '"LowerMoon" uppermoon1404@gmail.com',
            to: findEmail.email,
            subject: "Verification Code",
            text: `Your verification code is ${verificationCode}.`,
            html: `<b>Your verification code is ${verificationCode}.</b>`,
        };
         transporter.sendMail( resetMailOptions,async (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).send("Error sending email");
            }
            console.log("Message sent: %s", info.messageId);
            return res.json({
                email: findEmail.email,
                code: verificationCode,
                role: 'freelancer'
            });
        });
    }
        
    }catch(error){
        res.status(505).json({
            status: 'fail',
            message: error})
        } 
    };
    
    // verif Code
    exports.verifyCode = async(req,res)=>{
    try{
        const userVerifCode = req.body.userVerifCode
        const cookie = req.headers.cookie
        
        if(!cookie || cookie.includes('emailToken')){
            return res.status(400).
            json({
                status: 'fail',
                message: 'cookie not found!'
            })
        }
        const emailToken = cookie
        .split('; ')
        .find(row => row.startsWith('emailToken='))
        .split('=')[1];
        if (!emailToken) {
            return res.status(402)
            .json('unauthorized');
        }
        await jwt.verify(emailToken,process.env.ACCESS_TOKEN_SECRET,async(err,decoded)=>{
            if(err){
                return res.json({
                    status:'fail',
                    message: err
                })
            }
            const verifCode = decoded.verificationCode
            console.log(verifCode)
            if(userVerifCode == verifCode){
                return res.status(202).json({
                    status: 'success',
                    message: 'verif success'
                })
            }
            // checking code
            if(userVerifCode !== verifCode){
                return res.status(404).json({
                    status: 'fail',
                    message: 'verif code tidak sama!'
                })
            }
        })
    }catch(err){
        res.status(505).json({
            status:'fail',
            message: err
        })
    }
}

 exports.enterNewPassword = async(req,res)=>{
    const {password,confirmNewPassword} =req.body
    const cookie = req.headers.cookie
    if(!cookie || !cookie.includes('emailToken')){
        return res.status(400)
        .json({
            status: 'fail',
            message: 'cookie not found!'
        })
    }
    const emailToken = cookie
    .split('; ')
    .find(row => row.startsWith('emailToken='))
    .split('=')[1];
    if(!emailToken){
        return res.status(404)
        .json({
            status: 'fail',
            message: 'unauthorized!'
        })
    }
    await jwt.verify(emailToken,process.env.ACCESS_TOKEN_SECRET, async(err,decoded)=>{
        if(err){
            req.status(500).json({
                status: 'fail',
                message: err
            })
        }
            const email = decoded.email
            const findEmail = await freelancerTable.findOne({where: {email} })
        if(password !== confirmNewPassword){
                return res.status(402).json({
                    status: 'fail',
                    message: 'password - confirm password tidak sama!'
                })
            }
        if(findEmail){
            const hashedPassword = await bcrypt.hashSync(password,10)
            findEmail.update({password:hashedPassword});
            return res.status(202)
            .json({
                status: 'success',
            })
            }
    })

}


