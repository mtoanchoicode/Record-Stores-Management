module.exports.priceNewProducts = (products)=>{
    const newProducts = products.map((item) => {
        item.PriceNew = ((item.price * (100 - item.discountPercentage))/100).toFixed(0);
        return item
    })

    return newProducts
}

module.exports.priceNewProduct = (product)=>{
    const PriceNew = ((product.price * (100 - product.discountPercentage))/100).toFixed(0);
    return PriceNew
}