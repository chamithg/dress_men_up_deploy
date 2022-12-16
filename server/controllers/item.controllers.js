const Item = require("../models/item.models");

module.exports.findAllItems = (req, res) => {
  Item.find()
    .sort({ type: 1 })
    .then((allItems) => {
      res.json({ results: allItems });
    })
    .catch((err) => {
      res.json(err);
    });
};
module.exports.CreateNewItem = (req, res) => {
  Item.create(req.body)
    .then((newItem) => {
      res.json({ results: newItem });
    })
    .catch((err) => {
      res.json(err);
    });
};
module.exports.findOneItem = (req, res) => {
  Item.findOne({ _id: req.params.id })
    .then((foundItem) => {
      res.json({ results: foundItem });
    })
    .catch((err) => {
      res.json(err);
    });
};

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

module.exports.deleteOneItem = (req, res) => {
  Item.findOneAndRemove({ _id: req.params.id })
    .then((deletedItem) => {
      res.json({ results: deletedItem });
    })
    .catch((err) => {
      res.json(err);
    });
};
