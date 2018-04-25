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

	// API call for Location Browser
    app.get('/api/LocationBrowser/:name/:accommodations/:restaurants/:attractions', function (req, res) {

		// RETURN RESULTS WITH AVERAGE RATINGS HIGHER THAN THE ONES BELOW, OR NOT AT ALL IF -1
        var name = req.params.name;
        var accommodations = req.params.accommodations;
        var restaurants = req.params.restaurants;
        var attractions = req.params.attractions;
        res.json([
        	{
				name: "Test1",
				address: "2374 JKHjhs Rd",
				lat: 50,
				lng: 30,
				type: "Accomodation",
				rating: 4.5,
        	},
        	{
				name: "Test2",
				address: "2374 JKHjhs Rd",
				lat: 55,
				lng: 31,
				type: "Restaurant",
				rating: 4.5,
        	},
        	{
				name: "Test3",
				address: "2374 JKHjhs Rd",
				lat: 52,
				lng: 35,
				type: "Accomodation",
				rating: 4.5,
        	},
        ]);

    });
    
    // API call for Area Browser
    app.get('/api/AreaBrowser/:left/:bottom/:top/:right/:sort', function (req, res) {
		
		
		var left = req.params.left;
		var right = req.params.right;
		var top = req.params.top;
		var bottom = req.params.bottom;
		
		var sort = req.params.sort;
		
		// RETURN RESULTS WITHIN THESE BOUNDS
        
		res.json([
        	{
				name: "Test1",
				address: "2374 JKHjhs Rd",
				lat: 50,
				lng: 30,
				type: "Accomodation",
				rating: 4.5,
        	},
        	{
				name: "Test2",
				address: "2374 JKHjhs Rd",
				lat: 55,
				lng: 31,
				type: "Restaurant",
				rating: 4.5,
        	},
        	{
				name: "Test3",
				address: "2374 JKHjhs Rd",
				lat: 52,
				lng: 35,
				type: "Accomodation",
				rating: 4.5,
        	},
        ]);
		

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

    app.get('/travelLocations.html', function (req, res) {
		res.sendFile(__dirname + '/views/travelLocations.html');
    });
    
    app.get('/areaBrowser.html', function (req, res) {
		res.sendFile(__dirname + '/public/html/areaBrowser.html');
    });

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

