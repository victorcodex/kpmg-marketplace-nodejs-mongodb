const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let validateEmail = function(email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    firstname: {type: String, required: 'First Name is required', max: 30},
    lastname: {type: String, max: 30},
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    createdAt: {type: String, required: true, max: 100},
    updatedAt: {type: String, required: true, max: 100}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;