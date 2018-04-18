var mongoose = require('mongoose');

module.exports = mongoose.model('TravelLocation', {
    iso: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    lat: Number,
    lng: Number
});