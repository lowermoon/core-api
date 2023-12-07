const jwt = require("jsonwebtoken");

exports.jwtVerify = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.verify(payload, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                reject(err);
            }
            resolve(decoded);
        })
    })
}

exports.jwtSign = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, (err, token) => {
            if(err){
                reject(err);
            }
            resolve(token);
        })
    })
}