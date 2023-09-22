const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const {
  createVehicle,
  getAllVehicle,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/user.vehicle");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents"); // Destination directory for file uploads
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
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    ];
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only PDF, Excel, Word, and spreadsheet files are allowed."
        )
      );
    }
  },
});

router.post("/createVehicle", upload.single("vehicle_document"), createVehicle);
router.get("/getAllVehicle", getAllVehicle);
router.get("/getSingleVehicle/:id", getSingleVehicle);
router.put(
  "/updateVehicle/:id",
  upload.single("vehicle_document"),
  updateVehicle
);
router.delete("/deleteVehicle/:id", deleteVehicle);

module.exports = router;
