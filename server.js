// external libraries
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// internal libraries
const { sequelize, MapUserEvent } = require("./models");
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
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static("uploads"));

// socket io
io.on("connection", (socket) => {
  console.log("connected to socket io");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("locationUpdate", async (data) => {
    console.log(data);
    try {
      let exisitingUser = await MapUserEvent.findOne({
        where: {
          cred_id: data.cred_id,
          event_id: data.event_id,
        },
      });
      if (exisitingUser) {
        await MapUserEvent.update(
          {
            current_position: data.current_position,
            dest_distance: data.dest_distance,
            dest_arrival: data.dest_arrival,
            alternative_route: data.alternative_route,
          },
          {
            where: {
              cred_id: data.cred_id,
              event_id: data.event_id,
            },
          }
        )
          .then((updatedLocation) => {
            console.log("Location updated:", updatedLocation);
            // Broadcast the updated location to all connected clients except the sender
            socket.broadcast.emit("locationUpdated", data);
          })
          .catch((error) => {
            console.error("Error updating location:", error);
          });
      }
    } catch (error) {
      await MapUserEvent.create({
        cred_id: data.cred_id,
        event_id: data.event_id,
        current_position: data.current_position,
        dest_distance: data.dest_distance,
        dest_arrival: data.dest_arrival,
        alternative_route: data.alternative_route,
      })
        .then((createdLocation) => {
          console.log("Location saved:", createdLocation);
          // Broadcast the updated location to all connected clients except the sender
          socket.broadcast.emit("locationUpdated", data);
        })
        .catch((error) => {
          console.error("Error saving location:", error);
        });
    }
  });
});

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
server.listen("5123", () => {
  console.log("Server listening to 5123");
});
