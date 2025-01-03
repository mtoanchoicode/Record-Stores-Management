const Product = require("../../models/product.models")
const productHelper = require("../../helper/products")

// [GET] /search/

module.exports.index = async(req, res)=>{
    
    const keyword = req.query.keyword;
    let newProducts = []

    if(keyword){
        const keywordRegex = new RegExp(keyword, "i")

        const products = await Product.find({
            title: keywordRegex,
            status: "available",
            deleted: false
        })

        newProducts = productHelper.priceNewProducts(products)
    }

    res.render("client/pages/search/index" , {
        pageTitle: "Search Result",
        keyword: keyword,
        products: newProducts
    })
}