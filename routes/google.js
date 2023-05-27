var express = require("express");
var router = express.Router();
const axios = require("axios");
const JSONNormalize = require("json-normalize");

/* GET users listing. */
router.get("/", function (req, res, next) {
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
      console.log(reviews);
      res.render("google/google", {
        review: reviews,
      });
    });

  // res.render("google/google", {
  //   title: "Google Map",
  //   review: review,
  // });
});

module.exports = router;
