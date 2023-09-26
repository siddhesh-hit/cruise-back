const { EventDetail, MapUserEvent } = require("../models/index");
const { Op } = require("sequelize");

// post method
exports.createEventDetail = async (req, res) => {
  try {
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
    const currentDate = new Date();
    const eventTime = new Date(req.body.event_start_date);
    const eventData = {
      ...req.body,
      event_status: eventTime > currentDate ? "upcoming" : "ongoing",
      event_participants: [req.body.cred_id],
    };
    const eventDetail = await EventDetail.create(
      req.file
        ? {
            ...req.body,
            event_photo: req.file ? req.file.filename : null,
          }
        : eventData
    );
    if (eventDetail) {
      res.status(201).json(eventDetail);
    } else {
      res.status(402).json({
        message: "No data created",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get method
exports.getAllEventDetail = async (req, res) => {
  try {
    const eventDetail = await EventDetail.findAll();
    res.status(200).json(eventDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get single method
exports.getSingleEventDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    const eventDetail = await EventDetail.findOne({
      where: { event_id: id },
    });
    if (eventDetail) {
      res.status(200).json(eventDetail);
    } else {
      res.status(404).json({ error: "EventDetail not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update event status method
exports.updateEventStatus = async (req, res) => {
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
    const updated = await EventDetail.update(
      {
        event_status: "ongoing" || req.body.event_status,
      },
      {
        where: { event_id: id },
      }
    );
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({ error: "EventDetail not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// put method
exports.updateEventDetail = async (req, res) => {
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
    const updated = await EventDetail.update(
      req.file
        ? {
            ...req.body,
            event_photo: req.file ? req.file.filename : null,
          }
        : req.body,
      {
        where: { event_id: id },
      }
    );
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({ error: "EventDetail not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete method
exports.deleteEventDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    const deleted = await EventDetail.destroy({
      where: { event_id: id },
    });
    if (deleted) {
      res.status(204).send("EventDetail deleted");
    } else {
      res.status(404).json({ error: "EventDetail not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// cancel event method
exports.cancelEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }

    const event = await EventDetail.findOne({ where: { event_id: id } });

    if (!event) {
      res.status(404).json({ error: "EventDetail not found!" });
      return;
    }

    const updated = await EventDetail.update(
      {
        event_status: "cancelled",
      },
      {
        where: { event_id: id },
      }
    );
    if (updated) {
      res.status(200).json(updated);
    } else {
      res.status(404).json({ error: "EventDetail not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//find all upcoming events method
exports.getAllUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const eventDetail = await EventDetail.findAll({
      where: { event_status: "upcoming" },
    });
    res.status(200).json(eventDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//find all ongoing events method
exports.getAllOngoingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const eventDetail = await EventDetail.findAll({
      where: { event_status: "ongoing" },
    });
    res.status(200).json(eventDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// find all cancelled events method
exports.getAllCancelledEvents = async (req, res) => {
  try {
    const eventDetail = await EventDetail.findAll({
      where: { event_status: "cancelled" },
    });
    res.status(200).json(eventDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add participants in event method
exports.addParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    if (!req.body.cred_id) {
      res.status(501).json({
        message: "No cred_id passed",
      });
      return;
    }

    const event = await EventDetail.findOne({ where: { event_id: id } });

    if (!event) {
      res.status(404).json({ error: "EventDetail not found!" });
      return;
    }

    const newParticipant = req.body.cred_id;

    // Fetch existing participants or initialize an empty array
    const existingParticipants = event.event_requests || [];

    // Check if the new participant is already in the list
    if (existingParticipants.includes(newParticipant)) {
      res
        .status(300)
        .json({ message: "Participant already exists in the event." });
      return;
    }

    // Add the new participant
    existingParticipants.push(newParticipant);

    // Update the event_requests array
    const updated = await EventDetail.update(
      { event_requests: existingParticipants },
      { where: { event_id: id } }
    );

    if (updated) {
      res.status(200).json({ message: "Participant added successfully." });
    } else {
      res.status(500).json({ error: "Failed to update event participants." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// accept participants in event method
exports.acceptParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    if (!req.body.cred_id) {
      res.status(501).json({
        message: "No cred_id passed",
      });
      return;
    }

    const event = await EventDetail.findOne({ where: { event_id: id } });

    if (!event) {
      res.status(404).json({ error: "EventDetail not found!" });
      return;
    }

    const newParticipant = req.body.cred_id;

    // Fetch existing participants & requests or initialize an empty array
    const existingParticipants = event.event_participants || [];
    const existingRequests = event.event_requests || [];

    // Check if the new participant is already in the list
    if (existingParticipants.includes(newParticipant)) {
      res
        .status(300)
        .json({ message: "Participant already exists in the event." });
      return;
    }

    // Add the new participant
    existingParticipants.push(newParticipant);

    //remove the request from event_requests
    existingRequests.splice(existingRequests.indexOf(newParticipant), 1);

    // Update the event_requests array
    const updated = await EventDetail.update(
      {
        event_participants: existingParticipants,
        event_requests: existingRequests,
      },
      { where: { event_id: id } }
    );

    if (updated) {
      res.status(200).json({ message: "Participant added successfully." });
    } else {
      res.status(500).json({ error: "Failed to update event participants." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// remove participants in event method
exports.removeParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    if (!req.body.cred_id) {
      res.status(501).json({
        message: "No cred_id passed",
      });
      return;
    }

    const event = await EventDetail.findOne({ where: { event_id: id } });

    if (!event) {
      res.status(404).json({ error: "EventDetail not found!" });
      return;
    }

    const newParticipant = req.body.cred_id;

    // Fetch existing participants or initialize an empty array
    const existingParticipants = event.event_requests || [];

    // Check if the new participant is already in the list
    if (!existingParticipants.includes(newParticipant)) {
      res
        .status(300)
        .json({ message: "Participant does not exists in the event." });
      return;
    }

    // Add the new participant
    existingParticipants.splice(
      existingParticipants.indexOf(newParticipant),
      1
    );

    // Update the event_requests array
    const updated = await EventDetail.update(
      { event_requests: existingParticipants },
      { where: { event_id: id } }
    );

    if (updated) {
      res.status(200).json({ message: "Participant removed successfully." });
    } else {
      res.status(500).json({ error: "Failed to update event participants." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all events of a user method
exports.getAllUserEvents = async (req, res) => {
  try {
    console.log(req.params.id);
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }
    const eventDetail = await EventDetail.findAll({
      where: {
        event_participants: {
          [Op.contains]: [id],
        },
      },
    });
    res.status(200).json(eventDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all participants map detials of an event method
exports.getParticipantsMapDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(501).json({
        message: "No id passed",
      });
      return;
    }

    const eventDetail = await EventDetail.findOne({
      where: { event_id: id },
      include: [
        {
          model: MapUserEvent,
        },
      ],
    });

    if (eventDetail) {
      res.status(200).json(eventDetail);
    } else {
      res.status(404).json({ error: "EventDetail not found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal error " + error.message });
  }
};
