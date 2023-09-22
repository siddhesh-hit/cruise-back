const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const {
  createEventDetail,
  getAllEventDetail,
  getSingleEventDetail,
  updateEventStatus,
  updateEventDetail,
  deleteEventDetail,
  getAllOngoingEvents,
  getAllUpcomingEvents,
  addParticipants,
  acceptParticipants,
  removeParticipants,
  getAllUserEvents,
  getParticipantsMapDetails,
} = require("../controllers/user.event");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Destination directory for file uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

//add event
router.post("/addEventDetail", upload.single("event_photo"), createEventDetail);

//update event
router.put(
  "/updateEventDetail/:id",
  upload.single("event_photo"),
  updateEventDetail
);
router.put("/updateEventStatus/:id", updateEventStatus);
router.put("/addParticipants/:id", addParticipants);
router.put("/acceptParticipants/:id", acceptParticipants);
router.put("/removeParticipants/:id", removeParticipants);

//delete event
router.delete("/deleteEventDetail/:id", deleteEventDetail);

//get all ongoing events
router.get("/getAllEventDetail", getAllEventDetail);
router.get("/getSingleEventDetail/:id", getSingleEventDetail);
router.get("/getAllOngoingEvents", getAllOngoingEvents);
router.get("/getAllUpcomingEvents", getAllUpcomingEvents);
router.get("/getAllUserEvents/:id", getAllUserEvents);
router.get("/getParticipantsMapDetails/:id", getParticipantsMapDetails);

module.exports = router;
