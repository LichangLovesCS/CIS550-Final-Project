const TravelLocation = require('./app/models/TravelLocation');
const LocationFeature = require('./app/models/LocationFeature');
const FeatureRating = require('./app/models/FeatureRating');

function getTravelLocations(res) {
    TravelLocation.find(function (err, locations) {
        if (err) {
            res.send(err);
        }
        res.json(locations); // return all locations in JSON

    });
};

module.exports = function (app, passport) {

    // Get all TravelLocations
    app.get('/api/travelLocation', function (req, res) {

        getTravelLocations(res);

    });

    // Get specific TravelLocation
    app.get('/api/travelLocation/:location_id', function (req, res) {

        TravelLocation.find({

            _id: req.params.location_id

        }, function (err, locations) {
            if (err) {
                res.send(err);
            }
            res.json(locations);

        });

    });

    // Create TravelLocation and send back all TravelLocations after creation
    app.post('/api/travelLocation', function (req, res) {

        TravelLocation.create({

            text: req.body.text,
            done: false

        }, function (err, todo) {
            if (err) {
                res.send(err);
            }
            getTravelLocations(res);

        });

    });

    // Delete a TravelLocation
    app.delete('/api/travelLocation/:location_id', function (req, res) {
        TravelLocation.remove({

            _id: req.params.location_id

        }, function (err, location) {
            if (err) {
                res.send(err);
            }
            getTravelLocations(res);

        });
    });

    // Get all locationFeatures
    app.get('/api/locationFeatures', function (req, res) {
        LocationFeature.find(function (err, features) {
            if (err) {
                res.send(err);
            }
            res.json(features);

        });
    });

    // Get all FeatureRatings
    app.get('/api/featureRatings', function (req, res) {
        LocationFeature.find(function (err, ratings) {
            if (err) {
                res.send(err);
            }
            res.json(ratings);

        });
    });

    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    app.get('/login.ejs', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    app.get('/profile.ejs', function (req, res) {
        console.log(req.user);
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/signup'
        }));

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/map.html', function (req, res) {
        res.sendFile(__dirname + '/public/html/map.html');
    });

    // app.get('/travelLocations', function (req, res) {
    //     res.sendFile(__dirname + '/public/travelLocations.html');
    // });
    //
    // app.get('/locationFeatures', function (req, res) {
    //     res.sendFile(__dirname + '/public/locationFeatures.html');
    // });

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

