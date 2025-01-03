const Cart = require("../../models/cart.model")
const Product = require("../../models/product.models")

const productsHelper = require("../../helper/products")

// [GET] /cart/
module.exports.index = async (req, res)=>{

    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId
    })
    
    if (cart.products.length>0){
        for(const item of cart.products){
            const productId = item.product_id
            productInfo = await Product.findOne({
                _id: productId
            })

            productInfo.priceNew = productsHelper.priceNewProduct(productInfo)

            item.productInfo = productInfo

            item.totalPrice = item.quantity * productInfo.priceNew
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item)=>sum+item.totalPrice, 0)

    res.render("client/pages/cart/index", {
        pageTitle: "Shopping Cart",
        cartDetail: cart
    });
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await Cart.findOne({
        _id: cartId
    })


    const existProducInCart = cart.products.find(item => item.product_id == productId)

    if(existProducInCart){
        const newQuantity = quantity + existProducInCart.quantity
        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        },
        {
            'products.$.quantity': newQuantity
        }
        )
    }
    else{
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        )

        req.flash("success", "Product added succesfully")
    }


    res.redirect("back")
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId

    console.log(productId);
    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            "$pull": {products: {"product_id": productId}}
        }
    )

    req.flash("success", "Delete successfully")
    res.redirect("back")
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res)=>{
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = req.params.quantity

    await Cart.updateOne({
        _id: cartId,
        'products.product_id': productId
    },
    {
        'products.$.quantity': quantity
    })

    req.flash("success", "Update quanitity successfully")
    res.redirect("back")
}