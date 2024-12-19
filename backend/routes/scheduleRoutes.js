const express = require('express');
const router = express.Router();
const { getTournamentSchedule, getScheduleByDay } = require('../controllers/scheduleController');

// Schedule routes
router.get('/', getTournamentSchedule);   // Get full tournament schedule
router.get('/:day', getScheduleByDay);    // Get schedule for a specific day

module.exports = router;
