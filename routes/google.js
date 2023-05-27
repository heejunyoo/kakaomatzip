var express = require("express");
var router = express.Router();
const axios = require("axios");
global.geoData;

router.post("/clickdata", function (req, res, next) {
  const data = req.body;
  global.geoData = data;
});

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
      // console.log(reviews);
      res.render("google/google", {
        review: reviews,
        initialLatlng: { lat: 37.49969962500532, lng: 127.03235864639282 },
      });
    });
});

module.exports = router;
