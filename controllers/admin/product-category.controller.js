const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const CreateTreeHelper = require("../../helper/CreateTree") 


// [GET] /admin/products-category
module.exports.index = async (req, res)=>{
    let find = {
        deleted: false,
    };

    const records = await ProductCategory
        .find(find)

    const newRecords = CreateTreeHelper.tree(records)

    res.render("admin/pages/products-category/index", {
        pageTitle: "Category",
        records: newRecords
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res)=>{
    let find = {
        deleted: false
    }
    
    const records = await ProductCategory.find(find)

    const newRecords = CreateTreeHelper.tree(records)

    res.render("admin/pages/products-category/create", {
        pageTitle: "Create Category",
        records: newRecords
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res)=>{
    // if(permissions.includes("product-category_create")){
    //     if(req.body.position == ""){
    //         const countProducts = await ProductCategory.countDocuments();
    //         req.body.position = countProducts + 1
    //     }else{
    //         req.body.position = parseInt(req.body.position)
    //     }

    //     const record = new ProductCategory(req.body)
    //     await record.save()

    //     res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    // }else{
    //     return;
    // }
    if(req.body.position == ""){
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }

    const record = new ProductCategory(req.body)
    await record.save()

    res.redirect(`${systemConfig.prefixAdmin}/products-category`)
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res)=>{
    try {
        const id = req.params.id;

        const data = await ProductCategory.findOne({
            _id:id,
            deleted: false
        })
    
        const records = await ProductCategory.find({
            deleted:false
        })
        const newRecords = CreateTreeHelper.tree(records)
    
        res.render("admin/pages/products-category/edit", {
            pageTitle: "Edit Category",
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }


}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res)=>{
    const id = req.params.id;

    req.body.position = parseInt(req.body.position)

    
    await ProductCategory.updateOne({_id: id}, req.body)


    res.redirect("back")
}

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status
    const id = req.params.id

    await ProductCategory.updateOne({_id: id}, {status: status})

    req.flash("success", "Status Updated")

    res.redirect("back");
}