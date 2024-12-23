const Product = require("../../models/product.models")
const ProductCategory = require("../../models/product-category.model")
const Account = require("../../models/account.model")

const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const CreateTreeHelper = require("../../helper/CreateTree") 

// [GET] /admin/products

module.exports.index = async (req, res)=>{

    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if(req.query.status){
        find.status = req.query.status
    }

    const objectSearch = searchHelper(req.query)

    
    if(objectSearch.regex){
        find.title = objectSearch.regex
    }

    //Pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts

    )
    //Sort
    let sort = {}

    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }else{
        sort.position = "desc"
    }



    const products = await Product
        .find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products){
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        })
        if (user){
            product.accountFullName = user.fullName
        }
    }

    res.render("admin/pages/products/index", {
        pageTitle: "Product List",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({_id: id}, {status: status})

    req.flash("success", "Status Updated")

    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")

    switch(type){
        case "available":
            await Product.updateMany({_id:{$in:ids}}, {status: "available"})
            req.flash("success", `Status Updated for ${ids.length} products(s)`)
            break;
        case "unavailable":
            await Product.updateMany({_id:{$in:ids}}, {status: "unavailable"})
            req.flash("success", `Status Updated for ${ids.length} products(s)`)
            break;
        case "delete-all":
            await Product.updateMany({_id:{$in:ids}}, {deleted: true, deletedBy: {account_id: res.locals.user.id, deletedAt: new Date()}})
            req.flash("success", `${ids.length} products(s) deleted`)
            break;
        case "change-position":
            for(const item of ids){
                let[id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({_id:id}, {position: position})
            }
            
            req.flash("success", `Successfully changed position for ${ids.length} products(s)`)
           
            break;
        default:
            break;
    }
    res.redirect("back");
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id

    //await Product.deleteOne({_id: id})
    await Product.updateOne({_id: id}, {deleted:true, deletedBy: {account_id: res.locals.user.id, deletedAt: new Date()}})
    req.flash("success", `1 product deleted`)
    res.redirect("back");
}


// [GET] /admin/products/create

module.exports.create = async (req, res)=>{
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)
    const category = CreateTreeHelper.tree(records)

    res.render("admin/pages/products/create", {
        pageTitle: "New Product",
        category: category
    });
}

// [POST] /admin/products/create

module.exports.createPost = async (req, res)=>{
    req.body.price = parseInt(req.body.price)
    req.body.disscountPercentage = parseInt(req.body.disscountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1
    }else{
        req.body.position = parseInt(req.body.position)
    }
    
    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const product = new Product(req.body)
    await product.save()

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit/:id

module.exports.edit = async (req, res)=>{
    try{
        const find={
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
    
        const records = await ProductCategory.find({
            deleted: false
        })
        const category = CreateTreeHelper.tree(records)
    
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Edit Product",
            product: product,
            category: category
        });
    }
    catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

// [PATCH] /admin/products/edit/:id

module.exports.editPatch = async (req, res)=>{
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.disscountPercentage = parseInt(req.body.disscountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    try{
        await Product.updateOne({
            _id: id
        }, req.body)
        req.flash("success", `Successfully Updated`)
    } catch(error){
        req.flash("error", `Updated Fail`)
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/detail/:id

module.exports.detail = async (req, res)=>{
    try{
        const find={
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find)
    
        res.render("admin/pages/products/detail", {
            pageTitle: `${product.title}`,
            product: product
        });
    }
    catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}