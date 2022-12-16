const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

require(`dotenv`).config();
const cookieParser = require("cookie-parser");

const secretKey = process.env.SECRET_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

require("./server/config/mongoose.config");
require("./server/routes/user.routes")(app);
require("./server/routes/item.routes")(app);
require("./server/routes/cart.routes")(app);
require("./server/routes/rating.routes")(app);

app.listen(port, () => console.log(`listening on port:${port}`));
