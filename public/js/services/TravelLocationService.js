angular.module('TravelLocationService', []).factory('TravelLocations', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/api/travelLocations');
		},
		create : function(todoData) {
			return $http.post('/api/travelLocations', locationData);
		},
		delete : function(id) {
			return $http.delete('/api/travelLocations/' + id);
		}
	}
}]);