angular.module('TravelLocationController', [])

	.controller('mainController', ['$scope','$http','TravelLocations', function($scope, $http, TravelLocations) {

		$scope.loading = true;
				
		alert("HI");

		// when landing on the page, get all travel locations and show them
		TravelLocations.get().success(function(data) {
			$scope.locations = data;
			$scope.loading = false;
		});
		
		$scope.locations = [{name: "hi"}, {name: "sdfsdf"}];
		
		
		$scope.search = function() {
			console.log("hi");
		}

		$scope.highlightLocation = function(id) {
			$scope.loading = true;

			TravelLocations.get(id).success(function(data) {
				$scope.loading = false;
				
				// TODO: use location lat and lng here to highlight location on map or something

			});
		};
		
	}]);