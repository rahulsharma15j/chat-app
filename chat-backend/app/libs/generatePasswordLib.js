const bcrypt = require('bcrypt');
const saltRounds = 10;
const logger = require('./loggerLib');

/**Convert plain password to hash password. */
let hassPassword = (plainTextPassword)=>{
   return bcrypt.hashSync(plainTextPassword,bcrypt.genSaltSync(saltRounds));
}

/**Compare user password */
let comparePassword = (oldPassword, hashPassword, cb)=>{
   bcrypt.compare(oldPassword, hashPassword, (err, res)=>{
      if(err){
        logger.error(err.message,'Password comparison Error.', 5);
        cb(err,null);
      }else{
        cb(null, res);
      }
   });
}

/**Compare user password synchronously. */
let comparePasswordSync = (plainTextPassword,hash)=>{
   return bcrypt.compareSync(plainTextPassword, hash);
}

module.exports = {
    hashPassword: hassPassword,
    comparePassword:comparePassword,
    comparePasswordSync:comparePasswordSync
}
