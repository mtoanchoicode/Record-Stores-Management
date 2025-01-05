const md5 = require("md5")

const User = require ("../../models/user.model")
const ForgotPassword = require ("../../models/forgot-password.model")

const generateHelper = require("../../helper/generate")
const sendMailHelper = require("../../helper/sendMail")
const Cart = require("../../models/cart.model")

// [GET] /user/register
module.exports.register = async(req, res)=>{
    res.render("client/pages/user/register" , {
        pageTitle: "Registration"
    })
}

// [POST] /user/register
module.exports.registerPost = async(req, res)=>{
    console.log(req.body);
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    })

    if(existEmail){
        req.flash("error", `Email is existed`) 
        res.redirect("back")
        return;
    }

    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] /user/login
module.exports.login = async(req, res)=>{
    res.render("client/pages/user/login" , {
        pageTitle: "Log in"
    })
}

// [POST] /user/login
module.exports.loginPost = async(req, res)=>{
    const email = req.body.email
    const password =req.body.password

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash("error", `Wrong email or password`) 
        res.redirect("back")
        return;
    }
    if(md5(password) != user.password){
        req.flash("error", `Wrong email or password`) 
        res.redirect("back")
        return;
    }
    if(user.status == "inactive"){
        req.flash("error", `Account is disabled`) 
        res.redirect("back")
        return;
    }



    res.cookie("tokenUser", user.tokenUser)

    await Cart.updateOne({
        _id: req.cookies.cartId
    }, {
        user_id: user.id
    })

    res.redirect("/")
}

// [GET] /user/logout
module.exports.logout = async(req, res)=>{
    res.clearCookie("tokenUser")
    res.redirect("/")
}

// [GET] /user/passwrod/forgot
module.exports.forgotPassword = async(req, res)=>{
    res.render("client/pages/user/forgot-password" , {
        pageTitle: "Retrieve Password"
    })
}

// [POST] /user/passwrod/forgot
module.exports.forgotPasswordPost = async(req, res)=>{
    const email = req.body.email

    const user = await User.findOne({
        email: email,
        deleted: false
    })

    if(!user){
        req.flash("error", `Email is not existed`) 
        res.redirect("back")
        return;
    }

    const otp = generateHelper.generateRandomNumber(8)

    const objectForgotPassword={
        email: email,
        otp: otp,
        expiredAt: Date.now()
    }
    console.log(objectForgotPassword);
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save()

    const subject = "[Flow District] - OTP verification code to retrieve password"
    const html = `
    <p>OTP code is <b>${otp}</b>.</p><p>Note: Do not reveal the OTP code.</p><p>It will expire after 3 minutes.</p>
    `
    sendMailHelper.sendMail(email, subject, html)
    

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otpPassword = async(req, res)=>{
    const email = req.query.email

    res.render("client/pages/user/otp-password" , {
        pageTitle: "OTP Check",
        email: email
    })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async(req, res)=>{
    const email = req.body.email
    const otp = req.body.otp

    const result = await ForgotPassword.findOne({
        email:email,
        otp:otp
    })

    if(!result){
        req.flash("error", `Wrong OTP`) 
        res.redirect("back")
        return;
    }

    const user = await User.findOne({
        email:email
    })

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/user/password/reset")
}

// [GET] /user/password/reset
module.exports.resetPassword = async(req, res)=>{

    res.render("client/pages/user/reset-password" , {
        pageTitle: "Reset Pasword",
    })
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async(req, res)=>{
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser

    await User.updateOne({
        tokenUser: tokenUser
    },{
        password: md5(password)
    })

    res.redirect("/")
}

//[GET] /user/info
module.exports.info = async(req, res) =>{
    res.render("client/pages/user/info" , {
        pageTitle: "User Info",
    })
}