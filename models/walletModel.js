const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const configValues = require('../config/config');

const WalletSchema = new Schema({
    transactionType: {
        type: String,
        required: 'Transaction Type is required',
        enum: [configValues.WALLET_FUNDING_TRANSACTION, configValues.PURCHASE_TRANSACTION],
        max: 50
    },
    transactionByUser : { type: Schema.Types.ObjectId, ref: 'User' },
    product : { type: Schema.Types.ObjectId, ref: 'Product' },
    description: String,
    amount: {type: Number, required: 'Amount is required', default: 0},
    currentBalance: {type: Number, required: 'Current balance is required', default: 0},
    createdAt: {type: String, required: true, max: 100},
    updatedAt: {type: String, required: true, max: 100}
});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;