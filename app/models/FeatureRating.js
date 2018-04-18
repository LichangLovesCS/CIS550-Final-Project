var mongoose = require('mongoose');

module.exports = mongoose.model('FeatureRating', {
    feature: { // Need to connect this table to features, but how? By name? By _id?
        type: String,
        default: ''
    },
    rating: Number,
});