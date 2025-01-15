// routes/events.js
const express = require("express");
const Event = require("../../backend/models/Event");

const router = express.Router();

// Fetch all events
router.get("/allevents", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new event
router.post("/create", async (req, res) => {
  const data = req.body;

  console.log(data);

  const name = data.name;
  const date = data.date;
  const category = data.category;
  const image = data.image;

  // Basic validation: Ensure all fields are provided
  if (!name || !date || !category) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, date, category, image) are required.",
    });
  }

  // Validation for date format (optional based on your needs)
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Please provide a valid date.",
    });
  }

  try {
    // Create a new event document
    const newEvent = await Event.create({
      name,
      date: parsedDate, // Use the parsed date to ensure it's a valid Date object
      category,
    });

    // Send the response with the newly created event
    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event: newEvent,
    });
  } catch (error) {
    // Error handling
    console.error("Error during event creation:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to create the event.",
    });
  }
});

//update event
router.put("/edit/:id", async (req, res) => {
  const { name, date, category } = req.body;
  const eventId = req.params.id;

  console.log("Event ID:", eventId);
  console.log("Received data:", { name, date, category });

  if (!name || !date || !category) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedData = {
      name,
      date,
      category,
    };

    const updateEvent = await Event.findByIdAndUpdate(eventId, updatedData, {
      new: true,
    });

    if (!updateEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updateEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//delete event
router.delete("/delete", async (req, res) => {
  let id = req.body;

  try {
    const deleteEvent = await Event.deleteOne(id);
    return res.status(400).json({
      success: true,
      data: "deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
