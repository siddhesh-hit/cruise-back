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
const kycRoute = require("./routes/user.kyc.routes");

// defining cors & format
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});
app.use(express.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static("uploads"));

// socket namespace
const location = io.of("/location");
const chat = io.of("/chat");

// location socket io
location.on("connection", (socket) => {
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
            // socket.broadcast.emit("locationUpdated", data);
            socket.to(`event_${data.event_id}`).emit("locationUpdated", data);
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
          // socket.broadcast.emit("locationUpdated", data);
          socket.to(`event_${data.event_id}`).emit("locationUpdated", data);
        })
        .catch((error) => {
          console.error("Error saving location:", error);
        });
    }
  });

  socket.on("joinEvent", (event_id) => {
    // Join a room based on the event_id
    socket.join(`event_${event_id}`);
    console.log(`Socket joined room event_${event_id}`);
  });

  socket.on("leaveEvent", (event_id) => {
    // Leave a room based on the event_id
    socket.leave(`event_${event_id}`);
    console.log(`Socket left room event_${event_id}`);
  });
});

// chat socket io
chat.on("connection", (socket) => {
  console.log("User connected to chat");

  // Handle joining a group chat
  socket.on("joinEventChat", (eventId) => {
    socket.join(`event_${eventId}`);
    console.log(`User joined event chat for event ID: ${eventId}`);
  });

  // Handle leaving a group chat
  socket.on("leaveEventChat", (eventId) => {
    socket.leave(`event_${eventId}`);
    console.log(`User left event chat for event ID: ${eventId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from chat");
  });

  socket.on("chatMessage", ({ roomId, message }) => {
    // Broadcast the message to the specific room (event chat)
    chatNamespace.to(roomId).emit("newChatMessage", message);
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
app.use("/api/kyc", kycRoute);

// listening
server.listen("5123", () => {
  console.log("Server listening to 5123");
});
