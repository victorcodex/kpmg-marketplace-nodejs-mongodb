const Product = require('../models/productsModel');
const bodyParser = require('body-parser');

module.exports = (app) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const baseApiUrl = '/api/';

    // get all products
    app.get(baseApiUrl + 'products', (req, res) => {

        Product
            .find({})
            .populate('addedByUser', '_id firstname lastname')
            .exec((err, products) => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { "status": 200, "Result": products } );
            });

    });

    // get product by id
    app.get(baseApiUrl + 'product/:_id', (req, res) => {

        Product
            .findById( { _id: req.params._id })
            .populate('addedByUser', '_id firstname lastname')
            .exec((err, products) => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { "status": 200, "Result": products } );
        });

    });

    // create/update product
    app.post(baseApiUrl + 'product', (req, res) => {

        if(req.body._id) { // check if request have an id

            Product.findByIdAndUpdate(req.body._id,
            {
                title: req.body.title,
                description: req.body.description,
                addedByUser: req.body.addedByUser,
                price: req.body.price,
                updatedAt: Date.now()
            }, err => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { "status": 200, "message": "Successfully Updated Record"} );
            });

        } else {

            let newProduct = Product({
                title: req.body.title,
                description: req.body.description,
                addedByUser: req.body.addedByUser,
                price: req.body.price,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            newProduct.save(err => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { status: 200, message: 'New Product Added Successfully'});
            });

        }

    });

    // delete product by id
    app.delete(baseApiUrl + 'product', (req, res) => {

        Product.findByIdAndRemove(req.body._id, err => {
            if(err) {
                return res.send( { status: 500, message: err});
            }
            res.send( { "status": 200, "message": "Product Deleted Successfully"} );
        });

    });


};