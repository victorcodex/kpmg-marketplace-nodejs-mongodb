const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {type: String, required: 'title is required', max: 30},
    description: String,
    addedByUser : { type: Schema.Types.ObjectId, ref: 'User' },
    price: {type: Number, required: 'price is required'},
    createdAt: {type: String, required: true, max: 100},
    updatedAt: {type: String, required: true, max: 100}
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;