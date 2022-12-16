const ItemController = require("../controllers/item.controllers");

module.exports = (app) => {
  app.get("/api/items", ItemController.findAllItems);
  app.post("/api/items/new", ItemController.CreateNewItem);
  app.get("/api/items/:id", ItemController.findOneItem);
  app.put("/api/items/:id/update", ItemController.updateOneItem);
  app.delete("/api/items/:id/delete", ItemController.deleteOneItem);
};
