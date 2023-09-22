const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const {
  createUserDetails,
  getAllUserDetails,
  getUserDetails,
  updateUserDetails,
  deleteUserDetails,
} = require("../controllers/user.details");

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

const upload = multer({ storage: storage });

router.post("/addUserDetail", upload.single("photo"), createUserDetails);
router.get("/getAllUserDetail", getAllUserDetails);
router.get("/getUserDetail/:id", getUserDetails);
router.put("/updateUserDetail/:id", upload.single("photo"), updateUserDetails);
router.delete("/deleteUserDetail/:id", deleteUserDetails);

module.exports = router;
