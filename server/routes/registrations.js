
const express = require("express");
const mongoose = require("mongoose");

const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

const router = express.Router();

// POST /api/events/:id/register
router.post("/events/:id/register", async (req, res) => {
  let reservedEventId = null;

  try {
    const { name, email, studentId } = req.body;

    // 1. Validate event ID
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    // 2. Validate required fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof studentId !== "string" ||
      !studentId.trim()
    ) {
      return res.status(400).json({
        message: "Name, email and student ID are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedStudentId = studentId.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // 3. Find event
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const now = new Date();

    if (event.date <= now || event.registrationDeadline <= now) {
      return res.status(400).json({
        message: "Registration for this event is closed",
      });
    }

    // 4. Find the user by email OR student ID
    let user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { studentId: normalizedStudentId },
      ],
    });

    if (user) {
      // Ensure both identifiers belong to this same user
      if (
        user.email !== normalizedEmail ||
        user.studentId !== normalizedStudentId
      ) {
        return res.status(409).json({
          message: "Email or student ID belongs to another user",
        });
      }
    } else {
      try {
        user = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          studentId: normalizedStudentId,
          role: "student",
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(409).json({
            message: "Email or student ID is already in use",
          });
        }

        throw error;
      }
    }

    // 5. Check whether THIS user is registered for THIS event
    const existing = await Registration.findOne({
      eventId: event._id,
      userId: user._id,
    });

    if (existing) {
      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    // 6. Reserve a seat atomically to prevent overbooking
    const reservedEvent = await Event.findOneAndUpdate(
      {
        _id: event._id,
        $expr: { $lt: ["$seatsTaken", "$capacity"] },
        registrationDeadline: { $gt: now },
        date: { $gt: now },
      },
      {
        $inc: { seatsTaken: 1 },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!reservedEvent) {
      return res.status(409).json({
        message: "No seats available or registration is closed",
      });
    }

    reservedEventId = reservedEvent._id;

    // 7. Create registration
    const registration = await Registration.create({
      eventId: reservedEvent._id,
      userId: user._id,
      status: "confirmed",
    });

    // Registration saved; no rollback needed
    reservedEventId = null;

    return res.status(201).json({
      message: "Registration successful",
      registration: {
        id: registration._id,
        eventId: registration.eventId,
        userId: registration.userId,
        status: registration.status,
        registeredAt: registration.registeredAt,
      },
      seatsRemaining:
        reservedEvent.capacity - reservedEvent.seatsTaken,
    });
  } catch (error) {
    // Restore the reserved seat if registration creation failed
    if (reservedEventId) {
      try {
        await Event.updateOne(
          {
            _id: reservedEventId,
            seatsTaken: { $gt: 0 },
          },
          {
            $inc: { seatsTaken: -1 },
          }
        );
      } catch (rollbackError) {
        console.error("Seat rollback failed:", rollbackError.message);
      }
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
});

module.exports = router;
