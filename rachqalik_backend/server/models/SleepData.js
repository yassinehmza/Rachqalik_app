const mongoose = require('mongoose');

const sleepDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    quality: {
      type: String,
      enum: ['bad', 'average', 'good'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SleepData', sleepDataSchema);
