const bcrypt = require('bcrypt');
const  freelancerTable  = require('../tables/freelancerTable')
const { Op } = require('sequelize')



const createFreelancer = async function(freelancer_id,fullName,username,email,password){
    const hashedPassword = await bcrypt.hashSync(password,6)
    freelancerTable.create({
        freelancer_id,
        fullName,
        username,
        email,
        password:hashedPassword,
        });
}
const updateFreelancer = async function(password){
    const hashedPassword = await bcrypt.hashSync(password,6)
    freelancerTable.update({
        password:hashedPassword
    });
}

const findFreelancer = async function(username, password) {
    try {
        const user = await freelancerTable.findOne({ where: { username } });
        if (user) {
            const result = bcrypt.compareSync(password, user.password);
            if (result) {
                return user;
            }
        } else {
            return user;
        }
    } catch (error) {
        console.log(`Error Finding users:`, error);
        throw error;
    }
};

const loginEmail = async function(email,password) {
    try {
        const user = await freelancerTable.findOne({ where: { email } });
        if (user) {
            const result = bcrypt.compareSync(password, user.password);
            if (result) {
                return user;
            }
        } else {
            return user;
        }
    } catch (error) {
        console.log(`Error Finding users:`, error);
        throw error;
    }
}
const usernameFreelancer = async function(username){
    try{
        const user = await freelancerTable.findAll({where: {username}});
        if(user){
            return user;
        }
    }catch(error){
        console.log(`internal server error`,error );
        throw error;
    }
}

const emailFreelancer = async function(email){
    try{
        const user = await freelancerTable.findAll({where: {email}});
        if(user){
            return user;
        }
    }catch(error){
        console.log(`internal server error`,error );
        throw error;
    }
}

const emailResetFreelancer = async function(email){
    try{
        const user = freelancerTable.findOne({ where: { email } });
        if (user){
            return user.email;
        }
    }catch(error){
        console.log(`internal server error`, error);
        throw error
    }
}
module.exports = {
    createFreelancer,
    updateFreelancer,
    findFreelancer,
    usernameFreelancer,
    emailFreelancer,
    emailResetFreelancer
}