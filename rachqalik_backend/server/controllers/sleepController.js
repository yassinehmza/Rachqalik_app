const mongoose = require('mongoose');
const SleepData = require('../models/SleepData');

const createSleepData = async (req, res, next) => {
  try {
    const { duration, quality, date } = req.body;

    const validQualities = ['bad', 'average', 'good'];
    if (typeof duration !== 'number' || !quality) {
      return res.status(400).json({
        success: false,
        message: 'duration (number) and quality are required',
      });
    }
    if (!validQualities.includes(quality)) {
      return res.status(400).json({
        success: false,
        message: `quality must be one of: ${validQualities.join(', ')}`,
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

const getSleepStatsByUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const canRead = req.user.role === 'admin' || String(req.user._id) === String(id);
    if (!canRead) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const [stats] = await SleepData.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
          minDuration: { $min: '$duration' },
          maxDuration: { $max: '$duration' },
          goodNights: { $sum: { $cond: [{ $eq: ['$quality', 'good'] }, 1, 0] } },
          averageNights: { $sum: { $cond: [{ $eq: ['$quality', 'average'] }, 1, 0] } },
          badNights: { $sum: { $cond: [{ $eq: ['$quality', 'bad'] }, 1, 0] } },
        },
      },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7Days = await SleepData.find({
      userId: id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    if (!stats) {
      return res.status(200).json({
        success: true,
        data: {
          totalRecords: 0,
          avgDuration: 0,
          minDuration: 0,
          maxDuration: 0,
          qualityBreakdown: { good: 0, average: 0, bad: 0 },
          last7Days: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        totalRecords: stats.totalRecords,
        avgDuration: Math.round(stats.avgDuration * 10) / 10,
        minDuration: stats.minDuration,
        maxDuration: stats.maxDuration,
        qualityBreakdown: {
          good: stats.goodNights,
          average: stats.averageNights,
          bad: stats.badNights,
        },
        last7Days,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSleepData, getSleepDataByUser, getSleepStatsByUser };
