const Product = require("../../models/product.models")
const productHelper = require("../../helper/products")
// [GET] /
module.exports.index = async (req, res)=>{
    const productsFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "available"
    }).limit(3)

    const newProducts = productHelper.priceNewProducts(productsFeatured)

    const productsNew = await Product.find({
        deleted: false,
        status: "available"
    }).sort({position: "desc"}).limit(6)

    const newProductsNew = productHelper.priceNewProducts(productsNew)

    res.render("client/pages/home/index", {
        pageTitle: "Homepage",
        productsFeatured: newProducts,
        productsNew: newProductsNew
    });
}