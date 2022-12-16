const RatingController = require("../controllers/rating.controllers");

module.exports = (app) => {
  app.get("/api/ratings", RatingController.findAllItems);
  app.post("/api/ratings/new", RatingController.CreateNewItem);
  app.get("/api/ratings/:id", RatingController.findOne);
  app.put("/api/ratings/:id/update", RatingController.updateOneItem);
  app.delete("/api/ratings/:id/delete", RatingController.deleteOneItem);
};
