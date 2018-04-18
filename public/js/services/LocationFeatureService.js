angular.module('LocationFeatureService', []).factory('LocationFeatures', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/api/locationFeatures');
		},
	}
}]);