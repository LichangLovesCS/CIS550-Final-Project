const TravelLocation = require('./app/models/TravelLocation');
const LocationFeature = require('./app/models/LocationFeature');
const FeatureRating = require('./app/models/FeatureRating');

function getTravelLocations(res) {
    TravelLocation.find(function (err, locations) {
        if (err) { res.send(err); }
        res.json(locations); // return all locations in JSON
        
    });
};

module.exports = function (app) {

    // Get all TravelLocations
    app.get('/api/travelLocation', function (req, res) {

        getTravelLocations(res);

    });
    
    // Get specific TravelLocation
    app.get('/api/travelLocation/:location_id', function (req, res) {

        TravelLocation.find({
	        
            _id: req.params.location_id
            
        }, function (err, locations) {
            if (err) { res.send(err); }
			res.json(locations);
            
        });

    });

    // Create TravelLocation and send back all TravelLocations after creation
    app.post('/api/travelLocation', function (req, res) {
	    
        TravelLocation.create({
	        
            text: req.body.text,
            done: false
            
        }, function (err, todo) {
            if (err) { res.send(err); }
            getTravelLocations(res);

        });

    });

    // Delete a TravelLocation
    app.delete('/api/travelLocation/:location_id', function (req, res) {
        TravelLocation.remove({
	        
            _id: req.params.location_id
            
        }, function (err, location) {
            if (err) { res.send(err); }
            getTravelLocations(res);
            
        });
    });
    
    // Get all locationFeatures
    app.get('/api/locationFeatures', function (req, res) {
        LocationFeature.find(function (err, features) {
	        if (err) { res.send(err); }
	        res.json(features);
	        
	    });
    });
    
    // Get all FeatureRatings
    app.get('/api/featureRatings', function (req, res) {
        LocationFeature.find(function (err, ratings) {
	        if (err) { res.send(err); }
	        res.json(ratings);
	        
	    });
    });

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });
    
    app.get('/travelLocations', function (req, res) {
        res.sendFile(__dirname + '/public/travelLocations.html'); 
    });
    
    app.get('/locationFeatures', function (req, res) {
        res.sendFile(__dirname + '/public/locationFeatures.html'); 
    });

};
