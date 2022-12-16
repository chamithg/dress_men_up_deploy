const Rating = require("../models/rating.models");

//?find all items

module.exports.findAllItems = (req, res) => {
  Rating.find()
    .sort({ type: 1 })
    .then((allRatings) => {
      res.json({ results: allRatings });
    })
    .catch((err) => {
      res.json(err);
    });
};

//?create a new rating

module.exports.CreateNewItem = (req, res) => {
  Rating.findOne({ item: req.body.item }).exec((error, item) => {
    if (error) return res.status(400).json({ error });
    if (item) {
      // which means there is already review on that item
      Rating.findOneAndUpdate(
        { item: req.body.item },
        {
          $push: {
            reviews: req.body.review,
            // push new review to the exsisting reviews array
          },
        }
      )
        .then((updatedItem) => {
          res.json({ results: updatedItem });
        })
        .catch((err) => {
          res.json(err);
        });
      let tempTotal = 0;

      for (let i in item.reviews) {
        tempTotal += item.reviews[i].rating;
      }
      tempTotal += parseInt(req.body.review.rating);
      console.log(tempTotal, typeof tempTotal);
      console.log(item.reviews.length, typeof item.reviews.length);
      let oRate = Math.round(tempTotal / (item.reviews.length + 1));
      console.log("orate" + oRate);
      Rating.findOneAndUpdate(
        { item: req.body.item },
        {
          $set: {
            oRating: oRate,
          },
        }
      )
        .then((updatedItem) => {
          res.json({ results: updatedItem });
        })
        .catch((err) => {
          res.json(err);
        });
    } else {
      // no any rating available,
      newRating = {
        item: req.body.item,
        oRating: req.body.review.rating,
        reviews: [req.body.review],
      };
      Rating.create(newRating)
        .then((newItem) => {
          res.json({ results: newItem });
        })
        .catch((err) => {
          res.json(err);
        });
    }
  });
};

//?find ratings of single item

module.exports.findOne = (req, res) => {
  Rating.findOne({ item: req.params.id })
    .then((foundItem) => {
      res.json({ results: foundItem });
    })
    .catch((err) => {
      res.json(err);
    });
};

//? edit a review

module.exports.updateOneItem = (req, res) => {
  Item.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  })
    .then((updatedItem) => {
      res.json({ results: updatedItem });
    })
    .catch((err) => {
      res.json(err);
    });
};

//?find delete single review

module.exports.deleteOneItem = (req, res) => {
  Item.findOneAndRemove({ _id: req.params.id })
    .then((deletedItem) => {
      res.json({ results: deletedItem });
    })
    .catch((err) => {
      res.json(err);
    });
};
