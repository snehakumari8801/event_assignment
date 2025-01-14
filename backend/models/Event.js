// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,  // You can store the image URL or file path here
  },
});

module.exports = mongoose.model('Event', eventSchema);
