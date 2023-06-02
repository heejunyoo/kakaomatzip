var express = require("express");
var router = express.Router();
const axios = require("axios");

router.get(`/`, function (req, res, next) {
  let lat = parseFloat(req.query.lat);
  let lng = parseFloat(req.query.lng);

  placeId = "ChIJZQkCH3OlfDURoxoozUBZFg8";
  apikey = "AIzaSyDeqeFz2h2t3SRUE-QiD0Ss4XnniDHZ9_k";
  axios
    .get(
      "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
        placeId +
        "&key=" +
        apikey
    )
    .then((response) => {
      const placeDetails = response.data;
      const reviews = placeDetails.result.reviews;
      // console.log(reviews);
      res.render(`google/google`, {
        review: reviews,
        Latlng: { lat: lat, lng: lng },
      });
    });
});

router.get("/result", function (req, res, next) {
  let lat = parseFloat(req.query.lat);
  let lng = parseFloat(req.query.lng);

  res.render("google/result", {
    Latlng: { lat: lat, lng: lng },
  });
});

router.post("/clickdata", function (req, res, next) {
  const data = req.body;
  // console.log(data.lat);
  // return res.redirect(`/google/result?lat=${data.lat}&lng=${data.lng}`);
});

module.exports = router;