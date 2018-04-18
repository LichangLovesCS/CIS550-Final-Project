angular.module('FeatureRatingService', []).factory('FeatureRatings', ['$http', function($http) {
	return {
		get : function() {
			return $http.get('/api/featureRatings');
		},
	}
}]);