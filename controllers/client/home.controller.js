const ProductCategory = require("../../models/product-category.model")
const CreateTreeHelper = require("../../helper/CreateTree") 
// [GET] /
module.exports.index = async (req, res)=>{
    res.render("client/pages/home/index", {
        pageTitle: "Homepage"
    });
}