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