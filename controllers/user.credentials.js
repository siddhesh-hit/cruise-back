const {
  UserCredential,
  UserDetail,
  Vehicle,
  EventDetail,
  UserPost,
} = require("../models/index");
const { Op } = require("sequelize");

// post method
exports.createUser = async (req, res) => {
  try {
    if (!req.body) {
      res.status(501).json({
        message: "No data passed",
      });
      return;
    }

    const userCreds = await UserCredential.create(req.body);

    if (userCreds) {
      res.status(201).json(userCreds);
    } else {
      res.status(402).json({
        message: "No data created",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not registered " + error.message,
    });
  }
};

// get method
exports.getSingleUser = async (req, res) => {
  try {
    const params = req.params.id;
    if (!params) {
      res.status(501).json({
        message: "No data passed",
      });
      return;
    }

    const eventDetail = await EventDetail.findAll({
      where: {
        event_participants: {
          [Op.contains]: [params],
        },
      },
    });

    const userCreds = await UserCredential.findOne({
      where: { cred_id: params },
      include: [
        { model: UserDetail },
        { model: Vehicle },
        { model: EventDetail },
        { model: UserPost },
      ],
    });

    if (userCreds) {
      // Create the merged response object
      const mergedResponse = {
        cred_id: userCreds.cred_id,
        phone_number: userCreds.phone_number,
        oauth_provider: userCreds.oauth_provider,
        oauth_token: userCreds.oauth_token,
        followers: userCreds.followers,
        following: userCreds.following,
        userDetails: userCreds.UserDetail ? [userCreds.UserDetail] : [],
        vehicles: userCreds.Vehicles || [],
        eventDetails: userCreds.EventDetails || [],
        userPosts: userCreds.UserPosts || [],
        participatedEvents: eventDetail || [],
      };

      res.status(201).json(mergedResponse);
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not found " + error,
    });
  }
};

//get single user vehicledetails method
exports.getSingleUserVehicleDetails = async (req, res) => {
  try {
    const params = req.params.id;
    if (!params) {
      res.status(501).json({
        message: "No data passed",
      });
      return;
    }
    const userCreds = await UserCredential.findOne({
      where: { cred_id: params },
      include: [{ model: Vehicle }],
    });
    if (userCreds) {
      res.status(201).json(userCreds);
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not found " + error,
    });
  }
};

// get all method
exports.getAllUser = async (req, res) => {
  try {
    const userCreds = await UserCredential.findAll({
      include: [
        { model: UserDetail },
        { model: Vehicle },
        { model: EventDetail },
        { model: UserPost },
      ],
    });
    if (userCreds) {
      res.status(201).json(userCreds);
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not found",
    });
  }
};

// update method
exports.updateUser = async (req, res) => {
  try {
    const params = req.params.id;
    if (!params) {
      res.status(501).json({
        message: "No data passed",
      });
      return;
    }
    const userCreds = await UserCredential.update(req.body, {
      where: { cred_id: params },
    });
    if (userCreds) {
      res.status(201).json(userCreds);
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not updated",
    });
  }
};

//delete method
exports.deleteUser = async (req, res) => {
  try {
    const params = req.params.id;
    if (!params) {
      res.status(501).json({
        message: "No data passed",
      });
      return;
    }
    const userCreds = await UserCredential.destroy({
      where: { cred_id: params },
    });
    if (userCreds) {
      res.status(201).json("Data delelted successfully.");
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not deleted",
    });
  }
};

// add follower method
exports.addFollower = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No user id passed",
      });
      return;
    }
    const cred_id = req.body.cred_id;
    if (!cred_id) {
      res.status(501).json({
        message: "No cred_id passed",
      });
      return;
    }

    console.log(req.body);
    const user = await UserCredential.findByPk(id);

    if (!user) {
      res.status(404).json({
        message: "No user found",
      });
      return;
    }

    const followerArray = user.followers || [];

    if (followerArray.includes(cred_id)) {
      res.status(409).json({
        message: "Already following",
      });
      return;
    }

    followerArray.push(cred_id);

    const updatedData = await UserCredential.update(
      {
        followers: followerArray,
      },
      {
        where: {
          cred_id: id,
        },
      }
    );

    if (updatedData) {
      res.status(201).json({
        message: "Follower added successfully",
      });
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not updated" + error,
    });
  }
};

// remove follower method
exports.removeFollower = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No user id passed",
      });
      return;
    }
    const cred_id = req.body.cred_id;
    if (!cred_id) {
      res.status(501).json({
        message: "No cred_id passed",
      });
      return;
    }

    const user = await UserCredential.findByPk(id);

    if (!user) {
      res.status(404).json({
        message: "No user found",
      });
      return;
    }

    const followerArray = user.followers || [];

    if (!followerArray.includes(cred_id)) {
      res.status(409).json({
        message: "Not following",
      });
      return;
    }

    const updatedData = await UserCredential.update(
      {
        followers: followerArray.filter((item) => item !== cred_id),
      },
      {
        where: {
          cred_id: id,
        },
      }
    );

    if (updatedData) {
      res.status(201).json({
        message: "Follower removed successfully",
      });
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not updated" + error,
    });
  }
};

// add following method
exports.addFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No user id passed",
      });
      return;
    }
    const cred_id = req.body.cred_id;
    if (!cred_id) {
      res.status(501).json({
        message: "No cred_id passed",
      });
      return;
    }

    const user = await UserCredential.findByPk(id);

    if (!user) {
      res.status(404).json({
        message: "No user found",
      });
      return;
    }

    const followingArray = user.following || [];

    if (followingArray.includes(cred_id)) {
      res.status(409).json({
        message: "Already following",
      });
      return;
    }

    followingArray.push(cred_id);

    const updatedData = await UserCredential.update(
      {
        following: followingArray,
      },
      {
        where: {
          cred_id: id,
        },
      }
    );

    if (updatedData) {
      res.status(201).json({
        message: "Following added successfully",
      });
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not updated" + error,
    });
  }
};

//remove following method
exports.removeFollowing = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No user id passed",
      });
      return;
    }
    const cred_id = req.body.cred_id;
    if (!cred_id) {
      res.status(501).json({
        message: "No cred_id passed",
      });
      return;
    }

    const user = await UserCredential.findByPk(id);

    if (!user) {
      res.status(404).json({
        message: "No user found",
      });
      return;
    }

    const followingArray = user.following || [];

    if (!followingArray.includes(cred_id)) {
      res.status(409).json({
        message: "Not following",
      });
      return;
    }

    const updatedData = await UserCredential.update(
      {
        following: followingArray.filter((item) => item !== cred_id),
      },
      {
        where: {
          cred_id: id,
        },
      }
    );

    if (updatedData) {
      res.status(201).json({
        message: "Following removed successfully",
      });
    } else {
      res.status(402).json({
        message: "No data found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal error, not updated" + error,
    });
  }
};
