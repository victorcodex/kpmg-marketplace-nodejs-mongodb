let Wallet = require('../models/walletModel');
const bodyParser = require('body-parser');
const configValues = require('../config/config');

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

    // get Wallet Transcaction by User _id
    app.get(baseApiUrl + 'wallet/user/:transactionByUser', (req, res) => {

        Wallet
            .find( { transactionByUser: req.params.transactionByUser })
            .populate('transactionByUser', '_id firstname lastname')
            .populate('product')
            .exec((err, wallets) => {
                if(err) {
                    return res.send( { status: 500, message: err});
                }
                res.send( { "status": 200, "Result": wallets } );
            });

    });

    // get Wallet Transcaction by Product _id
    app.get(baseApiUrl + 'wallet/product/:product', (req, res) => {

        Wallet
            .find( { product: req.params.product })
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

        let getUserCurrentBalance = 0;
        let sumUserCurrentBalance = 0;

        Wallet.find( { transactionByUser: req.body.transactionByUser }, (err, wallet) => { // get user last wallet transaction

            if(err) return res.send( { status: 500, message: err});

            if(wallet[0]) getUserCurrentBalance = wallet[0]['currentBalance']; // get user wallet balance

            switch (req.body.transactionType) {

                // if transaction type is "WALLET_FUNDING", then plus to user current wallet balance
                case configValues.WALLET_FUNDING_TRANSACTION:
                    sumUserCurrentBalance = getUserCurrentBalance + req.body.amount;
                    break;

                // if transaction type is "PURCHASE", then minus from user current wallet balance
                case configValues.PURCHASE_TRANSACTION:
                    if(req.body.amount > getUserCurrentBalance ) {
                        return res.send( { status: 400, message: configValues.INSUFFICIENT_BALANCE});
                    }
                    sumUserCurrentBalance = getUserCurrentBalance - req.body.amount;
                    break;
            }

            if(req.body._id) { // check if request have an id

                //update user wallet
                Wallet.findByIdAndUpdate(req.body._id,
                    {
                        transactionType: req.body.transactionType,
                        transactionByUser: req.body.transactionByUser,
                        product: req.body.product,
                        description: req.body.description,
                        amount: req.body.amount,
                        currentBalance: sumUserCurrentBalance,
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
                    product: req.body.product,
                    description: req.body.description,
                    amount: req.body.amount,
                    currentBalance: sumUserCurrentBalance,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });

                newWalletTransaction.save(err => {
                    if (err) {
                        return res.send({status: 500, message: err});
                    }
                    res.send({status: 200, message: 'Wallet Transcaction Added Successfully'});
                });

            }

        }).limit(1).sort({$natural:-1}); // get user last wallet transaction

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