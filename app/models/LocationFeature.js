var mongoose = require('mongoose');

module.exports = mongoose.model('LocationFeature', {
    iso: { // Which city this feature belongs to
        type: String,
        default: ''
    },
    name: { // The name of this feature
        type: String,
        default: ''
    },
    type: { // What kind of feature this is (Restaurant, Beach, etc...)
        type: String,
        default: 'Misc'
    },
    lat: Number,
    lng: Number
});