var express = require("express");
var router = express.Router();
const axios = require("axios");

router.get(`/`, function (req, res, next) {
  let lat = parseFloat(req.query.lat);
  let lng = parseFloat(req.query.lng);

  apikey = "AIzaSyDeqeFz2h2t3SRUE-QiD0Ss4XnniDHZ9_k";

  placeIdsArray = [];
  placeDetailsArray = [];

  axios
    .get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        lat +
        "," +
        lng +
        "&radius=500&type=restaurant&key=" +
        apikey
    )
    .then((response) => {
      const nearbyDataDetails = response.data;
      for (let i = 0; i < nearbyDataDetails.results.length; i++) {
        placeIdsArray.push(nearbyDataDetails.results[i].place_id);
      }

      const requestInitial = placeIdsArray.map((placeId) =>
        axios.get(
          "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
            placeId +
            "&key=" +
            apikey
        )
      );

      Promise.all(requestInitial).then((responses) => {
        responses.forEach((response) => {
          const placeDetails = response.data.result;
          const placeName = placeDetails.name;
          const placeRaitingTotal = placeDetails.user_ratings_total;
          const placeUrl = placeDetails.url;
          const placeRating = placeDetails.rating;

          placeDetailsArray.push({
            name: placeName,
            ratingTotal: placeRaitingTotal,
            url: placeUrl,
            rating: placeRating,
          });
        });

        placeDetailsArray.sort((a, b) => b.ratingTotal - a.ratingTotal);

        res.render(`google/google`, {
          placeDetailsArray: placeDetailsArray,
          Latlng: { lat: lat, lng: lng },
        });
      });
    });
});

router.get("/update", function (req, res, next) {
  let lat = parseFloat(req.query.lat);
  let lng = parseFloat(req.query.lng);

  apikey = "AIzaSyDeqeFz2h2t3SRUE-QiD0Ss4XnniDHZ9_k";

  placeIdsArray = [];
  placeDetailsArray = [];

  axios
    .get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        lat +
        "," +
        lng +
        "&radius=500&type=restaurant&key=" +
        apikey
    )
    .then((response) => {
      const nearbyDataDetails = response.data;
      for (let i = 0; i < nearbyDataDetails.results.length; i++) {
        placeIdsArray.push(nearbyDataDetails.results[i].place_id);
      }

      const requests = placeIdsArray.map((placeId) =>
        axios.get(
          "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
            placeId +
            "&key=" +
            apikey
        )
      );

      Promise.all(requests).then((responses) => {
        responses.forEach((response) => {
          const placeDetails = response.data.result;
          const placeName = placeDetails.name;
          const placeRaitingTotal = placeDetails.user_ratings_total;
          const placeUrl = placeDetails.url;
          const placeRating = placeDetails.rating;

          placeDetailsArray.push({
            name: placeName,
            ratingTotal: placeRaitingTotal,
            url: placeUrl,
            rating: placeRating,
          });
        });

        placeDetailsArray.sort((a, b) => b.ratingTotal - a.ratingTotal);

        res.render(`google/update`, {
          placeDetailsArray: placeDetailsArray,
          Latlng: { lat: lat, lng: lng },
        });
      });
    });
});

// router.post("/clickdata", function (req, res, next) {
//   const data = req.body;
// });

module.exports = router;