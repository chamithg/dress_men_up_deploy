const userControllers = require("../controllers/user.controllers");
const UserController = require("../controllers/user.controllers");

module.exports = (app) => {
  app.get("/api/users", UserController.getAllUsers);
  app.post("/api/users/register", UserController.register);
  app.post("/api/users/login", UserController.login);
  app.get("/api/users/getloggedinuser", UserController.getLoggedUser);
  app.get("/api/users/logout", userControllers.logout);
  app.delete("/api/users/:id/delete", UserController.deleteOneItem);
};
