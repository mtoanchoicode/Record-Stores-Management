const md5 = require("md5")
const Account = require("../../models/account.model")

// [GET] /admin/my-account/

module.exports.index = (req, res)=>{
    res.render("admin/pages/my-account/index", {
        pageTitle: "My Account"
    });
}

// [GET] /admin/my-account/edit

module.exports.edit = (req, res)=>{
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Edit Account"
    });
}

// [PATCH] /admin/my-account/edit

module.exports.editPatch = async (req, res)=>{
    const id = res.locals.user.id
    const emailExist = await Account.findOne({
        _id: {$ne: id},
        email: req.body.email,
        deleted: false
    })
    if (emailExist){
        req.flash("error", `Email ${req.body.email} already exist`)
    }else{

        if(req.body.password){
            req.body.password = md5(req.body.password)
        }else{
            delete req.body.password
        }
        await Account.updateOne({_id: id}, req.body)

        req.flash("success", `Update Complete`)
    }
    res.redirect("back")
}