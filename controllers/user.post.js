const { UserPost } = require("../models/index");

// post method
exports.createUserPost = async (req, res) => {
  try {
    if (!req.body.cred_id) {
      console.log(req.body);
      return res.status(400).json({
        status: "fail",
        message: "cred_id is required",
      });
      return;
    }
    if (!req.body) {
      return res.status(400).json({
        status: "fail",
        message: "body is required",
      });
      return;
    }
    const userPost = await UserPost.create({
      ...req.body,
      post_photo: req.file ? req.file.filename : null,
    });
    if (userPost) {
      res.status(201).json({
        status: "success",
        data: userPost,
      });
    } else {
      res.status(501).json({
        status: "fail",
        message: "failed to create user post",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// get method
exports.getUserPost = async (req, res) => {
  try {
    const userPost = await UserPost.findAll();
    if (userPost) {
      res.status(200).json({
        status: "success",
        data: userPost,
      });
    } else {
      res.status(501).json({
        status: "fail",
        message: "failed to get user post",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// get single method
exports.getSingleUserPost = async (req, res) => {
  try {
    const params = req.params.id;
    if (!params) {
      return res.status(400).json({
        status: "fail",
        message: "post_id is required",
      });
      return;
    }
    const userPost = await UserPost.findOne({
      where: {
        post_id: params,
      },
    });
    if (userPost) {
      res.status(200).json({
        status: "success",
        data: userPost,
      });
    } else {
      res.status(501).json({
        status: "fail",
        message: "failed to get single user post",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// update method
exports.updateUserPost = async (req, res) => {
  try {
    const params = req.params.id;
    if (!params) {
      return res.status(400).json({
        status: "fail",
        message: "post_id is required",
      });
      return;
    }
    const userPost = await UserPost.update(
      req.file
        ? { ...req.body, post_photo: req.file ? req.file.filename : null }
        : req.body,
      {
        where: {
          post_id: params,
        },
      }
    );
    if (userPost) {
      res.status(200).json({
        status: "success",
        data: userPost,
      });
    } else {
      res.status(501).json({
        status: "fail",
        message: "failed to update user post",
      });
    }
  } catch (err) {
    res.status(501).json({
      status: "fail",
      message: err.message,
    });
  }
};

// delete method
exports.deleteUserPost = async (req, res) => {
  try {
    const params = req.params.id;
    if (!params) {
      return res.status(400).json({
        status: "fail",
        message: "post_id is required",
      });
      return;
    }
    const userPost = await UserPost.destroy({
      where: {
        post_id: params,
      },
    });
    if (userPost) {
      res.status(200).json({
        status: "success",
        data: userPost,
      });
    } else {
      res.status(501).json({
        status: "fail",
        message: "failed to delete user post",
      });
    }
  } catch (err) {
    res.status(501).json({
      status: "fail",
      message: err.message,
    });
  }
};
