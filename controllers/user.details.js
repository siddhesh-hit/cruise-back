const { UserDetail, UserCredential } = require("../models/index");

// post method
exports.createUserDetails = async (req, res) => {
  try {
    if (!req.body.cred_id) {
      res.status(400).send({
        message: "Specify the user id",
      });
      return;
    }
    const userDetail = await UserDetail.create({
      ...req.body,
      photo: req.file ? req.file.filename : null,
    });
    if (userDetail) {
      res.status(200).send({
        message: "User details created successfully",
        userDetail,
      });
    } else {
      res.status(500).send({
        message: "Some error occurred while creating the user details",
      });
    }
  } catch (error) {
    res.status(500).send({
      message:
        "Internal error occurred while creating the user details " + error,
    });
  }
};

// get all user method
exports.getAllUserDetails = async (req, res) => {
  try {
    const userDetail = await UserDetail.findAll();
    if (userDetail) {
      res.status(200).send({
        message: "User details fetched successfully",
        userDetail,
      });
    } else {
      res.status(404).send({
        message: "User details not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal error occurred while fetching the user details",
    });
  }
};

// get single user method
exports.getUserDetails = async (req, res) => {
  try {
    const userDetail = await UserDetail.findOne({
      where: { user_id: req.params.id },
      include: [{ model: UserCredential }],
    });
    if (userDetail) {
      res.status(200).send({
        message: "User details fetched successfully",
        userDetail,
      });
    } else {
      res.status(404).send({
        message: "User details not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal error occurred while fetching the user details",
    });
  }
};

//update user details method
exports.updateUserDetails = async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).send({
        message: "Specify the user id",
      });
      return;
    }
    console.log(req.body);
    if (req.file) {
    }
    const userDetail = await UserDetail.update(
      req.file ? { ...req.body, photo: req.file.filename } : req.body,
      {
        where: { user_id: req.params.id },
      }
    );
    if (userDetail) {
      res.status(200).send({
        message: "User details updated successfully",
        userDetail,
      });
    } else {
      res.status(404).send({
        message: "User details not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal error occurred while updating the user details",
    });
  }
};

// delete user details method
exports.deleteUserDetails = async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).send({
        message: "Specify the user id",
      });
      return;
    }
    const userDetail = await UserDetail.destroy({
      where: { user_id: req.params.id },
    });
    if (userDetail) {
      res.status(200).send({
        message: "User details deleted successfully",
        userDetail,
      });
    } else {
      res.status(404).send({
        message: "User details not found",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal error occurred while deleting the user details",
    });
  }
};
