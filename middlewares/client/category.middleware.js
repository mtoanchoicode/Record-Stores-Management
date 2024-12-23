const ProductCategory = require("../../models/product-category.model")
const CreateTreeHelper = require("../../helper/CreateTree") 

module.exports.category = async (req, res, next) =>{
    const productCategory = await ProductCategory.find({
        deleted: false
    })

    const newProductCategory = CreateTreeHelper.tree(productCategory)

    res.locals.layoutProductsCategory = newProductCategory

    next()
}