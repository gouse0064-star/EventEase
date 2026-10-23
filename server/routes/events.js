const requireOrganizer = require("../middleware/requireOrganizer");
const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");

const router = express.Router();

// GET /api/events — list events
router.get("/", async (req, res) => {
  console.log("GET /api/events received");

  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .maxTimeMS(5000);

    res.json({
      count: events.length,
      events
    });
  } catch (error) {
    console.error("Fetch events error:", error.message);

    res.status(500).json({
      message: "Failed to fetch events",
      error: error.message
    });
  }
});

// GET /api/events/:id — get one event
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID"
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(event);
  } catch (error) {
    console.error("Fetch event error:", error.message);
    res.status(500).json({ message: "Failed to fetch event" });
  }
});

// POST /api/events — create event
router.post("/", requireOrganizer, async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      venue,
      capacity,
      registrationDeadline
    } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof description !== "string" || !description.trim() ||
      typeof venue !== "string" || !venue.trim() ||
      !date || !registrationDeadline ||
      capacity === undefined || capacity === null || capacity === ""
    ) {
      return res.status(400).json({
        message: "All event fields are required"
      });
    }

    const eventDate = new Date(date);
    const deadline = new Date(registrationDeadline);
    const seats = Number(capacity);
    const now = new Date();

    if (
      !Number.isFinite(eventDate.getTime()) ||
      !Number.isFinite(deadline.getTime()) ||
      !Number.isInteger(seats) ||
      seats < 1 ||
      deadline <= now ||
      eventDate <= deadline
    ) {
      return res.status(400).json({
        message: "Invalid dates or capacity"
      });
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date: eventDate,
      venue: venue.trim(),
      capacity: seats,
      seatsTaken: 0,
      registrationDeadline: deadline
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });
  } catch (error) {
    console.error("Create event error:", error.message);
    res.status(500).json({ message: "Failed to create event" });
  }
});

module.exports = router;
