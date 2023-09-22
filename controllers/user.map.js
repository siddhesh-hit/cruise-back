const { MapUserEvent } = require("../models/index");

// create map of an user for an event
exports.createMap = async (req, res) => {
  try {
    const {
      cred_id,
      event_id,
      current_position,
      dest_distance,
      dest_arrival,
      alternative_route,
    } = req.body;

    if (!cred_id || !event_id) {
      res.status(400).json({ error: "Please provide cred_id and event_id" });
      return;
    }

    const mapData = await MapUserEvent.create({
      cred_id,
      event_id,
      current_position,
      dest_distance,
      dest_arrival,
      alternative_route,
    });

    if (mapData) {
      res.status(201).json({
        message: `Map model created for user ${cred_id} and event ${event_id}`,
        data: mapData,
      });
    } else {
      res.status(400).json({ error: "Unable to create map model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update map of an user for an event
exports.updateMap = async (req, res) => {
  try {
    const {
      cred_id,
      event_id,
      current_position,
      dest_distance,
      dest_arrival,
      alternative_route,
    } = req.body;

    if (!cred_id || !event_id) {
      res.status(400).json({ error: "Please provide cred_id and event_id" });
      return;
    }

    const mapData = await MapUserEvent.update(
      {
        current_position,
        dest_distance,
        dest_arrival,
        alternative_route,
      },
      {
        where: {
          cred_id,
          event_id,
        },
      }
    );

    if (mapData) {
      res.status(201).json({
        message: `Map model updated for user ${cred_id} and event ${event_id}`,
        data: mapData,
      });
    } else {
      res.status(400).json({ error: "Unable to update map model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get map of an user for an event
exports.getMap = async (req, res) => {
  try {
    const { cred_id, event_id } = req.body;

    if (!cred_id || !event_id) {
      res.status(400).json({ error: "Please provide cred_id and event_id" });
      return;
    }

    const mapData = await MapUserEvent.findOne({
      where: {
        cred_id,
        event_id,
      },
    });

    if (mapData) {
      res.status(201).json({
        message: `Map model found for user ${cred_id} and event ${event_id}`,
        data: mapData,
      });
    } else {
      res.status(400).json({ error: "Unable to find map model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all map of an event
exports.getAllMap = async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      res.status(400).json({ error: "Please provide event_id" });
      return;
    }

    const mapData = await MapUserEvent.findAll({
      where: {
        event_id,
      },
    });

    if (mapData) {
      res.status(201).json({
        message: `Map model found for event ${event_id}`,
        data: mapData,
      });
    } else {
      res.status(400).json({ error: "Unable to find map model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete map of an user for an event
exports.deleteMap = async (req, res) => {
  try {
    const { cred_id, event_id } = req.body;

    if (!cred_id || !event_id) {
      res.status(400).json({ error: "Please provide cred_id and event_id" });
      return;
    }

    const mapData = await MapUserEvent.destroy({
      where: {
        cred_id,
        event_id,
      },
    });

    if (mapData) {
      res.status(201).json({
        message: `Map model deleted for user ${cred_id} and event ${event_id}`,
        data: mapData,
      });
    } else {
      res.status(400).json({ error: "Unable to delete map model" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
