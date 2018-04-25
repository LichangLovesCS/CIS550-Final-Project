const mongoose = require('mongoose')
const axios = require('axios')

exports.attractionsReviewsUpdates = mongoose.model('london_attractions_reviews_calculates', new mongoose.Schema({
}), 'london_attractions_reviews_calculates', true)

exports.attractionsDetails = mongoose.model('london_attractions_details', new mongoose.Schema({
  id: Number
}), 'london_attractions_details', true)

exports.attractionsReviews = mongoose.model('london_attractions_reviews', new mongoose.Schema({
  reviews: String,
  placeId: Number
}), 'london_attractions_reviews', true)

exports.londonReviewsCaculate = mongoose.model('london_reviews_calculates', new mongoose.Schema({
  reviews: String,
  placeId: Number
}), 'london_reviews_calculates', true)

exports.londonReviews = mongoose.model('london_reviews', new mongoose.Schema({
}), 'london_reviews', true)

exports.londonReviewsCombine = mongoose.model('london_reviews_combine_calculates', new mongoose.Schema({
  source_place_id: Number
}), 'london_reviews_combine_calculates', true)


const fetchDetail = (id) => {
  return axios.get('http://tour-pedia.org/api/getPlaceDetails', {
    params: {
      id
    }
  }).then(res => res.data)
}

exports.fetchDetail = fetchDetail

exports.fetchDetailList = (docs, key = 'source_place_id') => {
  const placeIds = docs.map(doc => doc[key])
  const tasks = placeIds.map(fetchDetail)
  return Promise.all(tasks)
}
