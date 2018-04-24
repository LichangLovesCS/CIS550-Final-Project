const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
