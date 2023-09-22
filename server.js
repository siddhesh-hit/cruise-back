// external libraries
const express = require("express");
const cors = require("cors");

// internal libraries
const { sequelize } = require("./models");
const userCredRoute = require("./routes/user.credentials.routes");
const userDetailRoute = require("./routes/user.details.routes");
const eventRoute = require("./routes/user.events.routes");
const vehicleRoute = require("./routes/user.vehicle.routes");
const postRoute = require("./routes/user.post.routes");
const mapRoute = require("./routes/user.maps.routes");

// defining cors & format
const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static("uploads"));

// syncing the database
sequelize
  .sync()
  .then(() => console.log("Database is synced"))
  .catch((err) => console.log(err));

// routes
app.use("/api/user", userCredRoute);
app.use("/api/userDetail", userDetailRoute);
app.use("/api/event", eventRoute);
app.use("/api/vehicle", vehicleRoute);
app.use("/api/post", postRoute);
app.use("/api/map", mapRoute);

// listening
app.listen("5123", () => {
  console.log("Server listening to 5123");
});
