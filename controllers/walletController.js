let Wallet = require('../models/walletModel');
const bodyParser = require('body-parser');

module.exports = (app) => {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const baseApiUrl = '/api/';

    // get all Wallet Transcaction
    app.get(baseApiUrl + 'wallets', (req, res) => {

        Wallet
            .find({})
            .populate('transactionByUser', '_id firstname lastname')
            .populate('product')
            .exec((err, wallets) => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { "status": 200, "Result": wallets } );
            });

    });

    // get Wallet Transcaction by id
    app.get(baseApiUrl + 'wallet/:_id', (req, res) => {

        Wallet
            .findById( { _id: req.params._id })
            .populate('transactionByUser', '_id firstname lastname')
            .populate('product')
            .exec((err, wallets) => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { "status": 200, "Result": wallets } );
            });

    });

    // create/update Wallet
    app.post(baseApiUrl + 'wallet', (req, res) => {

        if(req.body._id) { // check if request have an id

            Wallet.findByIdAndUpdate(req.body._id,
                {
                    transactionType: req.body.transactionType,
                    transactionByUser: req.body.transactionByUser,
                    product: req.body.productID,
                    description: req.body.description,
                    amount: req.body.amount,
                    currentBalance: req.body.currentBalance,
                    updatedAt: Date.now()
                }, err => {
                    if(err) {
                        return res.send( { status: 500, message: err});
                    }
                    res.send( { "status": 200, "message": "Successfully Updated Record"} );
                });

        } else {

            let newWalletTransaction = Wallet({
                transactionType: req.body.transactionType,
                transactionByUser: req.body.transactionByUser,
                product: req.body.productID,
                description: req.body.description,
                amount: req.body.amount,
                currentBalance: req.body.currentBalance,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });




            // Wallet.find( { transactionByUser: req.params.transactionByUser }, function(err, wallet) {
            //     if(err) {
            //         return res.send( { status: 500, message: err});
            //     }
            //     res.send( { "status": 200, "wallet": wallet} );
            // });


            newWalletTransaction.save(err => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { status: 200, message: 'Wallet Transcaction Added Successfully'});
            });

        }

    });

    // delete Wallet Transcaction by id
    app.delete(baseApiUrl + 'wallet', (req, res) => {

        Wallet.findByIdAndRemove(req.body._id, err => {
            if(err) {
                return res.send( { status: 500, message: err});
            }
            res.send( { "status": 200, "message": "Wallet Transcaction Deleted Successfully"} );
        });

    });


};