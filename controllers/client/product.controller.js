const Product = require("../../models/product.models");
const ProductCategory = require("../../models/product-category.model");

const productHelper = require("../../helper/products")
const productCategoryHelper = require("../../helper/products-category")

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        status: "available",
        deleted: false
    }).sort({position: "desc"});

    const newProducts = productHelper.priceNewProducts(products)


    res.render("client/pages/products/index", {
        pageTitle: "Product Page",
        products: newProducts
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {

    try{
        const find={
            deleted: false,
            slug: req.params.slugProduct,
            status: "available"
        }

        const product = await Product.findOne(find)
        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "available",
                deleted: false
            })
            product.category = category
        }

        product.priceNew = productHelper.priceNewProduct(product);

        res.render("client/pages/products/detail", {
            pageTitle: `${product.title}`,
            product: product
        });
    }
    catch(error){
        res.redirect(`/products`)
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {

    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        deleted: false
    })

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id)
    const listSubCategoryId = listSubCategory.map(item => item.id)

    const products = await Product.find({
        product_category_id: {$in: [category.id, ...listSubCategoryId]},
        deleted: false
    }).sort({position: "desc"})

    const newProducts = productHelper.priceNewProducts(products)


    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    });
}