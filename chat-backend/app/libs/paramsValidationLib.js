let email = (email)=>{
   let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   if(email.match(emailRegex)){
     return email;
   }
   return false;
}

let password = (password)=>{
    let passwordRegex = /^[A-Za-z0-9]\w{7,}$/;
    if(password.match(passwordRegex)){
      return password;
    }
    return false;
}

module.exports = {
    email:email,
    password:password
}