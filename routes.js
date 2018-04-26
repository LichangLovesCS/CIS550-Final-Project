const mysql = require("mysql");
const TravelLocation = require('./app/models/TravelLocation');
const LocationFeature = require('./app/models/LocationFeature');
const FeatureRating = require('./app/models/FeatureRating');

var mysqldb = mysql.createConnection({
	host: "cis5503.cumb2j1rxmgj.us-east-2.rds.amazonaws.com",
	database: "cis550",
	user: "cis550",
	password: "password"
});
mysqldb.connect();


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
        
        
        var name = (req.params.name == -1) ? "" : req.params.name;
        var accommodationsLimit = req.params.accommodations;
        var restaurantsLimit = req.params.restaurants;
        var attractionsLimit = req.params.attractions;
        
        var nameClause = (name == "" || name == undefined) ? "" : ' AND name LIKE "%'+name+'%"';
        
        var attractionsRatingsLimited = "(SELECT location_id AS id, AVG(polarity) AS averageRating FROM reviews GROUP BY location_id HAVING AVG(polarity) > "+attractionsLimit+")";
        var attractions = "SELECT L.*, R.averageRating AS rating FROM locations L INNER JOIN "+attractionsRatingsLimited+" R ON L.id=R.id WHERE category='attraction'"+nameClause;
        
        var accommodationsRatingsLimited = "(SELECT location_id AS id, AVG(polarity) AS averageRating FROM reviews GROUP BY location_id HAVING AVG(polarity) > "+accommodationsLimit+")";
        var accommodations = "SELECT L.*, R.averageRating AS rating FROM locations L INNER JOIN "+accommodationsRatingsLimited+" R ON L.id=R.id WHERE category='accommodation'"+nameClause;
        
        var restaurantsRatingsLimited = "(SELECT location_id AS id, AVG(polarity) AS averageRating FROM reviews GROUP BY location_id HAVING AVG(polarity) > "+restaurantsLimit+")";
        var restaurants = "SELECT L.*, R.averageRating AS rating FROM locations L INNER JOIN "+restaurantsRatingsLimited+" R ON L.id=R.id WHERE category='restaurant'"+nameClause;
        
        var query = "(" + attractions + ") UNION (" + accommodations + ") UNION (" + restaurants + ")";
        
        console.log(query);
        
        mysqldb.query(query, function(err, data) {
			var results = JSON.parse(JSON.stringify(data));
			var responseData = [];
			results.forEach(function(elem) {
				console.log(elem);
				responseData.push(elem);
			});
			res.json(responseData);
		});
    
    });

    // API call for Area Browser
    app.get('/api/AreaBrowser/:leftB/:bottomB/:topB/:rightB/:sortB', function (req, res) {


        var leftB = req.params.leftB;
        var rightB = req.params.rightB;
        var topB = req.params.topB;
        var bottomB = req.params.bottomB;

        var sortB = req.params.sortB;

        // RETURN RESULTS WITHIN THESE BOUNDS
        var query = "SELECT L.*, R.averageRating AS averageRating FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating FROM reviews GROUP BY location_id) R ON L.id=R.id WHERE lat < "+topB+" AND lat > "+bottomB+" AND lng < "+rightB+" AND lng > "+leftB+" ORDER BY "+sortB;
		console.log(query);
        mysqldb.query(query, function(err, data) {
			var results = JSON.parse(JSON.stringify(data));
			var responseData = [];
			results.forEach(function(elem) {
				console.log(elem);
				responseData.push(elem);
			});
			res.json(responseData);
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

    app.get('/travelLocations.html', function (req, res) {
        res.sendFile(__dirname + '/views/travelLocations.html');
    });

    app.get('/areaBrowser.html', function (req, res) {
        res.sendFile(__dirname + '/views/areaBrowser.html');
    });

    app.get('/api/SearchQuestion/:id', function (req, res) {
        var id = req.params.id;

		var query;
        switch (id) {
	        
            // most checked into place
            case "1":
				query = "SELECT * FROM locations ORDER BY checkins DESC";                
                break;
                
            // most reviewed pubs
            case "2":
                query = "SELECT L.*, R.totalReviews FROM locations L INNER JOIN (SELECT location_id AS id, COUNT(id) AS totalReviews FROM reviews GROUP BY location_id) R ON L.id=R.id WHERE subcategory='pub' ORDER BY R.totalReviews DESC";                
                break;
                
            // best reviewed restaurants
            case "3":
                query = "SELECT L.*, R.averageRating FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating FROM reviews GROUP BY location_id) R ON L.id=R.id WHERE category='restaurant' ORDER BY R.averageRating DESC";                
                break;
                
            // The Top Rated Attractions in London
            case "4":
               query = "SELECT L.*, R.averageRating FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating, COUNT(id) AS totalReviews FROM reviews GROUP BY location_id) R ON L.id=R.id WHERE category='attraction' ORDER BY R.averageRating DESC, R.totalReviews DESC";                
               break;
                
            // The closest attractions to Big Ben
            case "5":
                query = "SELECT locations.*, SQRT(POW((locations.lat - 51.500696), 2) + POW((locations.lng + 0.124606), 2)) AS distance FROM locations ORDER BY distance";                
                break;
                
            // best type of location
            case "6":
                query = "SELECT subcategory, AVG(R.averageRating) AS averageSubcategoryRating FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating FROM reviews GROUP BY location_id) R ON L.id=R.id GROUP BY subcategory ORDER BY averageSubcategoryRating DESC";                
                break;
                
            // the best of the best attraction type
            case "7":
                query = "SELECT * FROM (SELECT L.*, R.averageRating AS averageLocationRating, R.totalRatings AS totalRatings FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating, COUNT(id) AS totalRatings FROM reviews GROUP BY location_id) R ON L.id=R.id) AS locationsWithRatings1 WHERE subcategory=(SELECT subcategory FROM (SELECT L.*, R.averageRating AS averageLocationRating, R.totalRatings AS totalRatings FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating, COUNT(id) AS totalRatings FROM reviews GROUP BY location_id) R ON L.id=R.id) AS locationsWithRatings2 WHERE category='attraction' GROUP BY subcategory HAVING COUNT(id) > 1 ORDER BY AVG(averageLocationRating) DESC, COUNT(totalRatings) DESC LIMIT 1) ORDER BY averageLocationRating DESC, totalRatings DESC";                
                break;
                /*
	                
	                The below query finds the best subcategory of attractions that have more than one location, and displays the top locations within that subcategory ordered by rating and total rating count
	                
					SELECT * FROM 
						(SELECT L.*, R.averageRating AS averageLocationRating, R.totalRatings AS totalRatings FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating, COUNT(id) AS totalRatings FROM reviews GROUP BY location_id) R ON L.id=R.id) AS locationsWithRatings1 
					WHERE subcategory=
						(SELECT subcategory FROM 
							(SELECT L.*, R.averageRating AS averageLocationRating, R.totalRatings AS totalRatings FROM locations L INNER JOIN (SELECT location_id AS id, AVG(polarity) AS averageRating, COUNT(id) AS totalRatings FROM reviews GROUP BY location_id) R ON L.id=R.id) AS locationsWithRatings2 
						WHERE category='attraction' GROUP BY subcategory HAVING COUNT(id) > 1 ORDER BY AVG(averageLocationRating) DESC, COUNT(totalRatings) DESC LIMIT 1) 
					ORDER BY averageLocationRating DESC, totalRatings DESC
					*/
            default:
                res.redirect('/travelLocations.html')
                break;
                
        }
        console.log(query);
        mysqldb.query(query, function(err, data) {
			var results = JSON.parse(JSON.stringify(data));
			var responseData = [];
			results.forEach(function(elem) {
				console.log(elem);
				responseData.push(elem);
			});
			res.json(responseData);
		});

    });

};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

