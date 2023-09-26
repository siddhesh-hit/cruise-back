const { Vehicle } = require("../models/index");

//post method
exports.createVehicle = async (req, res) => {
  try {
    console.log(req.body, req.file);
    if (!req.body.cred_id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    if (!req.body) {
      res.status(501).json({
        message: "No data passed",
      });
      return;
    }
    const vehicle = await Vehicle.create(
      req.file
        ? { ...req.body, vehicle_document: req.file ? req.file.filename : null }
        : req.body
    );
    if (vehicle) {
      res.status(201).json(vehicle);
    } else {
      res.status(402).json({
        message: "No data created",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get method
exports.getAllVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findAll();
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get single method
exports.getSingleVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    const vehicle = await Vehicle.findOne({
      where: { vehicle_id: id },
    });
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ error: "Vehicle not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// put method
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    if (!req.body) {
      res.status(501).json({
        message: "No data passed",
      });
      return;
    }
    const vehicle = await Vehicle.update(
      req.file
        ? { ...req.body, vehicle_document: req.file ? req.file.filename : null }
        : req.body,
      {
        where: { vehicle_id: id },
      }
    );
    if (vehicle) {
      res
        .status(200)
        .json({ vehicle, message: "Vehicle updated successfully" });
    } else {
      res.status(402).json({
        message: "No data updated",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete method
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    const vehicle = await Vehicle.destroy({
      where: { vehicle_id: id },
    });
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(402).json({
        message: "No data deleted",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
