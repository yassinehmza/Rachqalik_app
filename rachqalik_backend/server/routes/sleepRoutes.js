const express = require('express');
const { createSleepData, getSleepDataByUser } = require('../controllers/sleepController');
const { protect } = require('../middleware/authMiddleware');
const { requireActivePlan } = require('../middleware/freemiumMiddleware');

const router = express.Router();

router.post('/', protect, requireActivePlan, createSleepData);
router.get('/user/:id', protect, requireActivePlan, getSleepDataByUser);

module.exports = router;
