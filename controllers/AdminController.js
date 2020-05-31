const Order = require('../models/order');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/product-details', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        edit: false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user,
    });
    product
        .save()
        .then((result) => {
            console.log('exports.postAddProduct -> result', result);
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postAddProduct -> err', err);
        });
};

exports.getProductList = (req, res, next) => {
    Product.find()
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then((products) => {
            console.log('exports.getProductList -> products', products);
            res.render('admin/product-list', {
                prods: products,
                docTitle: 'Product-list: Admin',
                path: '/admin/product-list',
            });
        })
        .catch((err) => {
            console.log('exports.getProductList -> err', err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/product-details', {
                docTitle: 'Edit Product',
                path: '/admin/edit-product',
                edit: editMode,
                product: product,
            });
        })
        .catch((err) => {
            console.log('exports.getEditProduct -> err', err);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findById(id)
        .then((product) => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then((result) => {
            console.log('exports.postEditProduct -> result', result);
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postEditProduct -> err', err);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findByIdAndRemove(id)
        .then((result) => {
            return req.user.deleteCartItem(id);
        })
        .then(() => {
            res.redirect('product-list');
        })
        .catch((err) => {
            console.log('exports.postDeleteProduct -> err', err);
        });
};
