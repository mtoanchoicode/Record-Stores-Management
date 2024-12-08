const Product = require("../../models/product.models");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "available",
        deleted: false
    }).sort({position: "desc"});

    const newProducts = products.map(item => {
        item.PriceNew = (item.price * ((100 - item.discountPercentage)/100)).toFixed(0);
        return item
    });

    console.log(products)

    res.render("client/pages/products/index", {
        pageTitle: "Product Page",
        products: newProducts
    });
}