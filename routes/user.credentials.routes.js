const router = require("express").Router();

const {
  createUser,
  updateUser,
  getAllUser,
  getSingleUser,
  deleteUser,
  getSingleUserVehicleDetails,
  addFollower,
  removeFollower,
  addFollowing,
  removeFollowing,
} = require("../controllers/user.credentials");

router.post("/addUser", createUser);
router.get("/getAllUser", getAllUser);
router.put("/updateUser/:id", updateUser);
router.get("/getSingleUser/:id", getSingleUser);
router.get("/getSingleUserVehicleDetails/:id", getSingleUserVehicleDetails);
router.delete("/deleteUser/:id", deleteUser);

router.put("/addFollower/:id", addFollower);
router.put("/removeFollower/:id", removeFollower);
router.put("/addFollowing/:id", addFollowing);
router.put("/removeFollowing/:id", removeFollowing);

module.exports = router;
