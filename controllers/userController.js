const User = require('../models/userModel')
const Token = require('../models/tokenModel')
const crypto = require('crypto')
const sendEmail = require('../utils/setEmail')
//const { use } = require('../routes/categoryRoute')
const jwt=require('jsonwebtoken') //authentication
const {expressjwt}=require('express-jwt')




// to register user
exports.postUser = async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
        //req.body refers to the value user enter
    })
    //  to check if email is already register
    User.findOne({ email: user.email })
        .then(async data => {
            if (data) {
                return res.status(400).json({ error: 'Email is already registered' })
            }
            else {
                user = await user.save()
                if (!user) {
                    return res.status(400).json({ error: 'unable to create an account' })
                }
                // create token and save it to the token  model
                let token = new Token({
                    token: crypto.randomBytes(16).toString('hex'),
                    userId: user._id
                })
                token = await token.save()
                if (!token) {
                    return res.status(400).json({ error: 'failed to creaye a token' })
                }

                // send email process
                const url=process.env.FRONTEND_URL+'\/email\/confirmation\/'+token.token
                //http:localhost:3000/email/confirmation/6y62
                sendEmail({
                    from: 'no-reply@ecommerce.com',
                    to: user.email,
                    subject: 'Email verification link',
                    text: `Hello,\n\n please verify your email by click in the below link:\n\n
                http:\/\/${req.headers.host} \/api\/confirmation\/${token.token}`,
              //   http://localhost:8000/api/confirmation/456789 
              html:`
              <h1>Verify Your Email Account</h1>
              <a href=${url}> Click to verify </a>
              `
                })

                res.send(user)
            }
        })
}

// post email confirmation
exports.postEmailConfirmation = (req, res) => {
    //at first find the valid or matching token
    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                return res.status(400).json({ error: 'invalid token or expired token' })
            }

            // if we found the valid token then find the valid user for that token
            User.findOne({ _id: token.userId })
                .then(user => {
                    if (!user) {
                        return res.status(400).json({ error: 'we are unable to find the valid user for this token' })
                    }

                    //check if user is already verified or not
                    if (user.isVerified) {
                        return res.status(400).json({ error: 'email is already verified,Please login to continue' })
                    }

                    //save the verified user
                    user.isVerified = true
                    user.save()
                        .then(user => {
                            if (!user) {
                                return res.status(400).json({ error: 'failed to verify the email' })
                            }
                            res.json({ message: 'congrats, your email has been verified successfully' })
                        })
                        .catch(err => {
                            return res.status(400).json({ error: err })
                })
            })
                .catch(err => {
                return res.status(400).json({ error: err })
            })
        })
            .catch(err => {
             return res.status(400).json({ error: err })
         })
        

}

// signin process
exports.signIn=async(req,res)=>{
    const{email,password}=req.body
    // first check if email is registered in the system or not
    const user=await User.findOne({email})
    if(!user){
        return res.status(503).json({error:'sorry the email you provided is not found in our system,Register first or try again'})
    }
    //if email found check the password
    if(!user.authenticate(password)){
        return res.status(400).json({error:'email and password doesnot match'})
    }
    // check if user is verified or not
    if (!user.isVerified){
        return res.status(400).json({error:'verify email first to continue'})
    }
    // now generate token with user id and jwt secret
    const token=jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET)
    //store token in the cookie
    res.cookie('myCookie',token,{expire:Date.now()+99999})
    //return user information to frontend
    const{_id,name,role}=user
    return res.json({token,user:{name,role,email,_id}})
    res.send(user)
}
//forget password
exports.forgetPassword=async(req,res)=>{
    const user= await User.findOne({email:req.body.email})
    if(!user){
        return res.status(403).json({error:'sorry the email you provided is not found in our system,register first or try another'})
    }
    let token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        userId: user._id
    })
    token=await token.save()
    if (!token) {
        return res.status(400).json({ error: 'failed to create a token' })
    }
    //SEND EMAIL PROCES
    sendEmail({
        from: 'no-reply@ecommerce.com',
        to: user.email,
        subject: 'Password Reset link',
        text: `Hello,\n\n please reset your password by click in the below link:\n\n
    http:\/\/${req.headers.host} \/api\/resetpassword\/${token.token}`
    })
    res.json({message:'password reset link has been sent successfully'})
}

//reset password
exports.resetPassword=async(req,res)=>{
    //find valid token
    let token=await Token.findOne({token:req.params.token})
    if(!token){
        return res.status(400).json({error:'invalid token or token expired'})
    }
    // if we found the valid token then find the valid user for the token
    let user=await User.findOne({_id:token.userId})
    if(!user){
        return res.status(400).json({error:'unable to find the valid user for this token'})
    }
     // password change
     user.password=req.body.password
     user=await user.save()
     if(!user){
        return res.status(500).json({error:'failed to reset password'})
     }
     res.json({message:'password has been reset successfully,login to continue'})
    
}

//user list
 exports.userList=async(req,res)=>{
    const user =await User.find()
    .select('-hashed_password')  //dont show hashed_password
    .select('-salt')
    if(!user){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.send(user)
 }
//  user details
 exports.userDetails=async(req,res)=>{
    const user=await User.findById(req.params.id)
    .select('hashed_password')
    .select('-salt')
    if(!user){
        return res.status(400).json({error:'Something went wrong'})
    }
    res.select(user)
 }

 // SignOut
 exports.signOut=(req,res)=>{
    res.clearCookie('myCookie')
    res.json({message:'signout'})
 }
 // require signin (we need to sigin before entering some page so if not singin the middleware should stop for entering those pages)
 exports.requireSignin=expressjwt({
    secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:'auth'
 })

  //middleware for user role
  exports.requireUser=(req,res,next)=>{
    //verify JWT
    expressjwt({
        secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:'auth'
    })(req,res,(err)=>{
        if(err){
            return res.status(400).json({error:'Unauthorized'})
        }
        // check the role
        if(req.auth.role===0){
              //grant access
              next()
        }
        else{
            // unauthorized role
            return req.status(403).json({error:'Forbidden'})

        }
    })
    
  }

  //middleware for admin role
  exports.requireAdmin=(req,res,next)=>{
    //verify JWT
    expressjwt({
        secret:process.env.JWT_SECRET,
    algorithms:['HS256'],
    userProperty:'auth'
    })(req,res,(err)=>{
        if(err){
            return res.status(400).json({error:'Unauthorized'})
        }
        // check the role
        if(req.auth.role===1){
              //grant access
              next()
        }
        else{
            // unauthorized role
            return req.status(403).json({error:'Forbidden'})

        }
    })
}