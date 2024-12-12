const Role = require("../../models/role.models")

const systemConfig = require("../../config/system")

// [GET] /admin/role

module.exports.index = async(req, res)=>{

    let find = {
        deleted: false
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/index", {
        pageTitle: "Permission",
        records: records
    });
}

// [GET] /admin/role/create

module.exports.create = async(req, res)=>{
    res.render("admin/pages/roles/create", {
        pageTitle: "Create Roles"
    });
}

// [POST] /admin/role/create

module.exports.createPost = async(req, res)=>{

    const records = new Role(req.body)
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/role/edit/:id

module.exports.edit = async(req, res)=>{
    try {
        const id = req.params.id

        let find = {
            _id: id,
            deleted: false
        }

        const data = await Role.findOne(find)

        res.render("admin/pages/roles/edit", {
            pageTitle: "Edit Roles",
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
    
}

// [PATCH] /admin/roles/edit/:id

module.exports.editPatch = async(req, res)=>{
    try{
        const id = req.params.id

        await Role.updateOne({_id: id}, req.body)

        req.flash("success", "Status Updated")
    }
    catch (error){
        req.flash("error", "Update Fail")
    }
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}