const mongoose = require('mongoose');
const SleepData = require('../models/SleepData');

const createSleepData = async (req, res, next) => {
  try {
    const { duration, quality, date } = req.body;

    if (typeof duration !== 'number' || !quality) {
      return res.status(400).json({
        success: false,
        message: 'duration (number) and quality are required',
      });
    }

    const sleepData = await SleepData.create({
      userId: req.user._id,
      duration,
      quality,
      date: date || new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Sleep data created successfully',
      data: sleepData,
    });
  } catch (error) {
    next(error);
  }
};

const getSleepDataByUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const canRead = req.user.role === 'admin' || String(req.user._id) === String(id);

    if (!canRead) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const sleepData = await SleepData.find({ userId: id }).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: sleepData.length,
      data: sleepData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSleepData, getSleepDataByUser };
