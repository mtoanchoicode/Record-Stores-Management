module.exports.registerPost = (req, res, next)=>{
    if(!req.body.fullName){
        req.flash("error", `Please fill in the fullName`) 
        res.redirect("back")
        return;
    }
    if(!req.body.email){
        req.flash("error", `Please fill in the email`) 
        res.redirect("back")
        return;
    }
    if(!req.body.password){
        req.flash("error", `Please fill in the password`) 
        res.redirect("back")
        return;
    }
    next();
}

module.exports.loginPost = (req, res, next)=>{
    if(!req.body.email){
        req.flash("error", `Please fill in the email`) 
        res.redirect("back")
        return;
    }
    if(!req.body.password){
        req.flash("error", `Please fill in the password`) 
        res.redirect("back")
        return;
    }
    next();
}

module.exports.forgotPasswordPost = (req, res, next)=>{
    if(!req.body.email){
        req.flash("error", `Please fill in the email`) 
        res.redirect("back")
        return;
    }
    next();
}

module.exports.otpPasswordPost = (req, res, next)=>{
    if(!req.body.otp){
        req.flash("error", `Please fill in the otp`) 
        res.redirect("back")
        return;
    }
    next();
}

module.exports.resetPasswordPost = (req, res, next)=>{
    if(!req.body.password){
        req.flash("error", `Please fill in the password`) 
        res.redirect("back")
        return;
    }
    if(!req.body.confirmPassword){
        req.flash("error", `Please fill in the confirm Password`) 
        res.redirect("back")
        return;
    }
    if(req.body.confirmPassword != req.body.password){
        req.flash("error", `Password confirm is not same with password`) 
        res.redirect("back")
        return;
    }
    next();
}