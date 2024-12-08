module.exports.createPost = (req, res, next)=>{
    if(!req.body.title){
        req.flash("error", `Please fill in the title`) 
        res.redirect("back")
        return;
    }
    next();
}