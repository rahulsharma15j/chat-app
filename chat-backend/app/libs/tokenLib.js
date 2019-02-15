const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const secretKey = 'someVeryRandomStringThatNobodyCanGuess';

/**
 * Function to generate token.
 * @param {*} data 
 * @param {*} cb 
 */
let generateToken = (data,cb)=>{
   try{
       let claims = {
           jwtid: shortId.generate(),
           iat: Date.now(),
           exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
           sub: 'authToken',
           iss: 'chatApp',
           data: data
       };

       let tokenDetails = {
           token: jwt.sign(claims,secretKey),
           tokenSecret: secretKey
       };
       cb(null,tokenDetails);
   }catch(err){
     console.log(err);
     cb(err,null);
   }
}

/**
 * Function to verify token.
 * @param {*} token 
 * @param {*} cb 
 */
let verifyClaim = (token, secretKey,cb)=>{
   jwt.verify(token, secretKey, (err,decoded)=>{
      if(err){
         console.log("Error while verify token.");
         console.log(err);
         cb(err,null);
      }else{
          console.log('user verified.');
          console.log(decoded);
          cb(null,decoded);
      }
   });
}

module.exports = {
    generateToken:generateToken,
    verifyClaim:verifyClaim
}