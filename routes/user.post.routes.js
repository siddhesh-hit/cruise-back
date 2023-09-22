const multer = require("multer");
const path = require("path");
const router = require("express").Router();
const {
  createUserPost,
  getUserPost,
  deleteUserPost,
  getSingleUserPost,
  updateUserPost,
} = require("../controllers/user.post");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/posts");
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

router.post("/addUserPost", upload.single("post_photo"), createUserPost);
router.get("/getAllUserPost", getUserPost);
router.put("/updateUserPost/:id", upload.single("post_photo"), updateUserPost);
router.get("/getSingleUserPost/:id", getSingleUserPost);
router.delete("/deleteUserPost/:id", deleteUserPost);

module.exports = router;
