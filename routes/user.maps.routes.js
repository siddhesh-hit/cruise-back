const router = require("express").Router();
const {
  createMap,
  deleteMap,
  getAllMap,
  getMap,
  updateMap,
} = require("../controllers/user.map");

router.post("/createMap", createMap);
router.get("/getMap", getMap);
router.get("/getAllMap", getAllMap);
router.put("/updateMap", updateMap);
router.delete("/deleteMap", deleteMap);

module.exports = router;
