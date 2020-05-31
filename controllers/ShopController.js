const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Home',
                path: '/',
            });
        })
        .catch((err) => {
            console.log('exports.getIndex -> err', err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render('shop/products', {
                prods: products,
                docTitle: 'Products',
                path: '/products',
            });
        })
        .catch((err) => {
            console.log('exports.getIndex -> err', err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                docTitle: 'Product Details',
                path: '/products',
            });
        })
        .catch((err) => {
            console.log('exports.getProduct -> err', err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render('shop/cart', {
                docTitle: 'Cart',
                path: '/cart',
                products: products,
            });
        })
        .catch((err) => {
            console.log('exports.getCart -> err', err);
        });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    console.log('exports.postCart -> productId', productId);
    Product.findById(productId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.deleteCartItem = (req, res, next) => {
    const id = req.body.productId;
    req.user
        .deleteCartItem(id)
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user })
        .then((orders) => {
        console.log("exports.getOrders -> orders", orders.products)
            res.render('shop/orders', {
                docTitle: 'Orders',
                path: '/orders',
                orders: orders,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map((p) => {
                return {
                    quantity: p.quantity,
                    product: { ...p.productId._doc },
                    // product: p.productId,
                };
            });
            const order = new Order({
                products: products,
                user: {
                    name: req.user.name,
                    userId: req.user,
                },
            });
            return order.save();
        })
        .then(() => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('orders');
        })
        .catch((err) => {
            console.log(err);
        });
};
