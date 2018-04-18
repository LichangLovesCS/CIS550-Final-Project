angular.module('TravelLocationController', [])

	.controller('mainController', ['$scope','$http','TravelLocations', function($scope, $http, TravelLocations) {

		$scope.loading = true;

		// when landing on the page, get all travel locations and show them
		TravelLocations.get().success(function(data) {
			$scope.locations = data;
			$scope.loading = false;
		});

		// when clicking "Process Data", start compiling data from different sources/APIs
		$scope.processData = function() {

			$scope.loading = true;
			TravelLocations.get().success(function(data) {
				data.forEach(function(location) {
						
					// TODO: ignore this, this is where I'm trying to compile data from Google's APIs, etc
					
				});
			});

		};

		$scope.highlightLocation = function(id) {
			$scope.loading = true;

			TravelLocations.get(id).success(function(data) {
				$scope.loading = false;
				
				// TODO: use location lat and lng here to highlight location on map or something

			});
		};
		
	}]);