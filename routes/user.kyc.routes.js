const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const {
  createKYC,
  deleteKYC,
  getAllKYC,
  getKYC,
  updateKYC,
} = require("../controllers/user.kyc");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/kyc");
  },
  filename: function (req, file, cb) {
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

router.post("/createKYC", upload.single("kyc_document"), createKYC);
router.get("/getKYC/:id", getKYC);
router.get("/getAllKYC", getAllKYC);
router.put("/updateKYC", upload.single("kyc_document"), updateKYC);
router.delete("/deleteKYC", deleteKYC);

module.exports = router;
